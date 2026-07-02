import { useCallback, useEffect, useRef } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";

import "@excalidraw/excalidraw/index.css";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { AppState, BinaryFiles, ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import type { IViewportState, IWhiteboardFile } from "../hooks/use-livekit-room";

interface ExcalidrawBoardProps {
  onLocalChange: (elements: readonly ExcalidrawElement[]) => void;

  // fast, best-effort broadcast fired on (almost) every draw tick so
  // remote viewers see strokes/drags live instead of waiting for the
  // throttled reliable sync. Optional so this component still works if a
  // caller doesn't wire it up.
  onLocalPreviewChange?: (elements: readonly ExcalidrawElement[]) => void;

  incomingElements: readonly ExcalidrawElement[] | null;

  isPresenting?: boolean;
  isFollowing?: boolean;
  incomingViewport?: IViewportState | null;
  activePresenterIdentity?: string | null;
  onViewportChange?: (scrollX: number, scrollY: number, zoom: number) => void;

  // a follower just asked (or re-asked) the presenter for their live
  // viewport. Changing the `nonce` each time is what re-triggers the effect
  // even if the requester is the same person clicking Follow twice in a row.
  viewportRequest?: { requesterIdentity: string; nonce: number } | null;

  onFileAdd?: (file: IWhiteboardFile) => void;
  incomingFile?: IWhiteboardFile | null;

  // NEW: "someone's drawing over here" ping — fires (throttled) whenever
  // this user edits the board while NOT presenting, carrying their current
  // scroll/zoom so others can offer a one-time "jump there" action.
  onActivityPing?: (scrollX: number, scrollY: number, zoom: number) => void;

  // NEW: a one-shot request (bumped nonce so repeats re-trigger) to snap
  // this client's own viewport to the given scroll/zoom, e.g. after the
  // user taps someone else's activity badge. Distinct from incomingViewport
  // "follow" — this is a single jump, not a continuous follow.
  jumpToViewport?: { scrollX: number; scrollY: number; zoom: number; nonce: number } | null;
}

function useThrottledCallback<T extends (...args: any[]) => void>(fn: T, interval: number) {
  const lastCallRef = useRef(0);
  const pendingArgsRef = useRef<Parameters<T> | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const elapsed = now - lastCallRef.current;
      pendingArgsRef.current = args;

      if (elapsed >= interval) {
        lastCallRef.current = now;
        fn(...args);
      } else if (!timerRef.current) {
        timerRef.current = setTimeout(() => {
          timerRef.current = null;
          lastCallRef.current = Date.now();
          if (pendingArgsRef.current) fn(...pendingArgsRef.current);
        }, interval - elapsed);
      }
    },
    [fn, interval]
  );
}

function reconcileElements(
  localElements: readonly ExcalidrawElement[],
  remoteElements: readonly ExcalidrawElement[]
): ExcalidrawElement[] {
  const merged = new Map<string, ExcalidrawElement>();
  for (const el of localElements) merged.set(el.id, el);
  for (const remoteEl of remoteElements) {
    const localEl = merged.get(remoteEl.id);
    if (!localEl || (remoteEl.version ?? 0) > (localEl.version ?? 0)) {
      merged.set(remoteEl.id, remoteEl);
    }
  }
  return Array.from(merged.values());
}

export function ExcalidrawBoard({
  onLocalChange,
  onLocalPreviewChange,
  incomingElements,
  isPresenting = false,
  isFollowing = false,
  incomingViewport = null,
  activePresenterIdentity = null,
  onViewportChange,
  viewportRequest = null,
  onFileAdd,
  incomingFile = null,
  onActivityPing, // NEW
  jumpToViewport = null, // NEW
}: ExcalidrawBoardProps) {
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const boardWrapperRef = useRef<HTMLDivElement>(null);
  const isApplyingRemoteRef = useRef(false);
  const isApplyingRemoteViewportRef = useRef(false);

  // prevents rebroadcasting whiteboard elements when nothing actually
  // changed (e.g. onChange firing on pure mouse-move with no edits).
  //
  // IMPORTANT: this is intentionally a content fingerprint, NOT a `!==`
  // reference check on the elements array. Excalidraw mutates elements
  // in place during an active drag/freedraw stroke for performance, so it
  // keeps handing back the SAME array reference while the stroke is in
  // progress. version/versionNonce is what Excalidraw itself bumps on
  // every mutation, in-place or not, so it's a reliable "did anything
  // really change" signal.
  const lastFingerprintRef = useRef<string | null>(null);

  const fingerprintElements = (elements: readonly ExcalidrawElement[]) =>
    elements.map((el) => `${el.id}:${(el as any).versionNonce ?? el.version ?? 0}`).join(",");

  const knownFileIdsRef = useRef<Set<string>>(new Set());

  const throttledViewportSend = useThrottledCallback(
    (scrollX: number, scrollY: number, zoom: number) => {
      onViewportChange?.(scrollX, scrollY, zoom);
    },
    120
  );

  // Reliable "source of truth" sync.
  const throttledBroadcast = useThrottledCallback((elements: readonly ExcalidrawElement[]) => {
    onLocalChange(elements);
  }, 150);

  // fast, lightly-throttled preview broadcast for live drawing feedback.
  const throttledPreviewBroadcast = useThrottledCallback(
    (elements: readonly ExcalidrawElement[]) => {
      onLocalPreviewChange?.(elements);
    },
    30
  );

  // NEW: throttled "I'm drawing over here" ping. 1s is intentionally much
  // coarser than the drawing-sync throttles above — this only needs to be
  // frequent enough to keep a badge alive/fresh on other clients, not to
  // feel like live drawing feedback.
  const throttledActivityPing = useThrottledCallback(
    (scrollX: number, scrollY: number, zoom: number) => {
      onActivityPing?.(scrollX, scrollY, zoom);
    },
    1000
  );

  const handleChange = (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles
  ) => {
    const fingerprint = fingerprintElements(elements);
    const elementsChanged = fingerprint !== lastFingerprintRef.current;
    lastFingerprintRef.current = fingerprint;

    if (isApplyingRemoteRef.current) {
      isApplyingRemoteRef.current = false;
    } else if (elementsChanged) {
      throttledBroadcast(elements);
      throttledPreviewBroadcast(elements); // live feedback, in parallel with the reliable sync

      // NEW: let others know activity is happening at this viewport, but
      // only when not presenting — presenting already broadcasts viewport
      // continuously below, so a separate ping would be redundant.
      if (!isPresenting) {
        throttledActivityPing(appState.scrollX, appState.scrollY, appState.zoom.value);
      }
    }

    if (isApplyingRemoteViewportRef.current) {
      isApplyingRemoteViewportRef.current = false;
    } else if (isPresenting) {
      throttledViewportSend(appState.scrollX, appState.scrollY, appState.zoom.value);
    }

    if (files && onFileAdd) {
      for (const fileId of Object.keys(files)) {
        if (!knownFileIdsRef.current.has(fileId)) {
          knownFileIdsRef.current.add(fileId);
          const file = files[fileId];
          onFileAdd({ id: fileId, dataURL: file.dataURL });
        }
      }
    }
  };

  useEffect(() => {
    if (!incomingElements || !apiRef.current) return;
    const localElements = apiRef.current.getSceneElementsIncludingDeleted();
    const reconciled = reconcileElements(localElements, incomingElements);
    isApplyingRemoteRef.current = true;
    apiRef.current.updateScene({ elements: reconciled });
  }, [incomingElements]);

  useEffect(() => {
    if (!incomingViewport || !apiRef.current || !isFollowing) return;
    if (activePresenterIdentity && incomingViewport.identity !== activePresenterIdentity) return;

    isApplyingRemoteViewportRef.current = true;
    apiRef.current.updateScene({
      appState: {
        scrollX: incomingViewport.scrollX,
        scrollY: incomingViewport.scrollY,
        zoom: { value: incomingViewport.zoom as any },
      },
    });
  }, [incomingViewport, isFollowing, activePresenterIdentity]);

  useEffect(() => {
    if (!isPresenting || !apiRef.current) return;
    const appState = apiRef.current.getAppState();
    onViewportChange?.(appState.scrollX, appState.scrollY, appState.zoom.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPresenting]);

  useEffect(() => {
    if (!viewportRequest || !isPresenting || !apiRef.current) return;
    const appState = apiRef.current.getAppState();
    onViewportChange?.(appState.scrollX, appState.scrollY, appState.zoom.value);
  }, [viewportRequest, isPresenting]);

  // NEW: one-shot jump, e.g. after tapping another user's activity badge.
  // Deliberately does NOT set isApplyingRemoteViewportRef — that guard exists
  // to stop the "follow" effect above from re-broadcasting a viewport it just
  // received, but this is the local user's own action (and onViewportChange
  // only fires from handleChange while isPresenting, which is unaffected
  // here), so nothing needs to be suppressed.
  useEffect(() => {
    if (!jumpToViewport || !apiRef.current) return;
    apiRef.current.updateScene({
      appState: {
        scrollX: jumpToViewport.scrollX,
        scrollY: jumpToViewport.scrollY,
        zoom: { value: jumpToViewport.zoom as any },
      },
    });
  }, [jumpToViewport]);

  useEffect(() => {
    if (!incomingFile || !apiRef.current) return;
    if (knownFileIdsRef.current.has(incomingFile.id)) return;
    knownFileIdsRef.current.add(incomingFile.id);

    const mimeType = incomingFile.dataURL.match(/^data:([^;]+);/)?.[1] || "image/png";
    apiRef.current.addFiles([
      {
        id: incomingFile.id as any,
        dataURL: incomingFile.dataURL as any,
        mimeType: mimeType as any,
        created: Date.now(),
      },
    ]);
  }, [incomingFile]);

  return (
    <div
      ref={boardWrapperRef}
      className="relative h-full w-full overflow-hidden rounded-md border"
    >
      <Excalidraw
        excalidrawAPI={(api) => (apiRef.current = api)}
        onChange={handleChange}
        initialData={{
          appState: {
            viewBackgroundColor: "#ffffff",
          },
        }}
      />
    </div>
  );
}