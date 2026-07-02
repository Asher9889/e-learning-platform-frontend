import { useCallback, useEffect, useRef, useState } from "react";
import {
  ConnectionState,
  LocalParticipant,
  Participant,
  Room,
  RoomEvent,
  RemoteParticipant,
  Track,
} from "livekit-client";

export type IWhiteboardElement = any;

export interface IChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: number;
}

export interface ISharedFile {
  id: string;
  senderId: string;
  senderName: string;

  fileName: string;
  mimeType: string;
  size: number;

  dataURL: string;
}
export interface ICursorPosition {
  identity: string;
  name: string;
  x: number;
  y: number;
  color: string;
}

export interface IViewportState {
  identity: string;
  scrollX: number;
  scrollY: number;
  zoom: number;
}

export interface IPresenterStatus {
  identity: string;
  name: string;
  presenting: boolean;
}

export interface IWhiteboardFile {
  id: string;
  dataURL: string;
}

// a lightweight "someone is drawing over here" ping, sent by a non-presenting
// user's own scroll/zoom position whenever they edit the board. Lets other
// clients show a "jump to X" affordance without full presenter/follow mode.
export interface IActivityPing {
  identity: string;
  name: string;
  scrollX: number;
  scrollY: number;
  zoom: number;
}

const FILE_CHUNK_SIZE = 12000;

const FILE_CHUNK_SEND_DELAY_MS = 20;

interface UseLiveKitRoomArgs {
  token: string | undefined;
  serverURL: string | undefined;
  onWhiteboardMessage?: (elements: IWhiteboardElement[]) => void;
  onCursorMessage?: (cursor: ICursorPosition) => void;
  onViewportMessage?: (viewport: IViewportState) => void;
  onPresenterStatusMessage?: (status: IPresenterStatus) => void;
  onParticipantLeft?: (identity: string) => void;
  onFileMessage?: (file: IWhiteboardFile) => void;
  onViewportRequestMessage?: (requesterIdentity: string) => void;
  onActivityMessage?: (activity: IActivityPing) => void;
  onChatMessage?: (message: IChatMessage) => void;

  onSharedFileMessage?: (file: ISharedFile) => void;
}

export function useLiveKitRoom({
  token,
  serverURL,
  onWhiteboardMessage,
  onCursorMessage,
  onViewportMessage,
  onPresenterStatusMessage,
  onParticipantLeft,
  onFileMessage,
  onViewportRequestMessage,
  onActivityMessage,
  onChatMessage,
  onSharedFileMessage
}: UseLiveKitRoomArgs) {
  const roomRef = useRef<Room | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.Disconnected
  );
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [localParticipant, setLocalParticipant] = useState<LocalParticipant | null>(null);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onWhiteboardMessageRef = useRef(onWhiteboardMessage);
  const onCursorMessageRef = useRef(onCursorMessage);
  const onViewportMessageRef = useRef(onViewportMessage);
  const onPresenterStatusMessageRef = useRef(onPresenterStatusMessage);
  const onParticipantLeftRef = useRef(onParticipantLeft);
  const onFileMessageRef = useRef(onFileMessage);
  const onViewportRequestMessageRef = useRef(onViewportRequestMessage);
  const onActivityMessageRef = useRef(onActivityMessage);

  const onChatMessageRef = useRef(onChatMessage);
  const onSharedFileMessageRef = useRef(onSharedFileMessage);
  useEffect(() => {
    onWhiteboardMessageRef.current = onWhiteboardMessage;
    onCursorMessageRef.current = onCursorMessage;
    onViewportMessageRef.current = onViewportMessage;
    onPresenterStatusMessageRef.current = onPresenterStatusMessage;
    onParticipantLeftRef.current = onParticipantLeft;
    onFileMessageRef.current = onFileMessage;
    onViewportRequestMessageRef.current = onViewportRequestMessage;
    onActivityMessageRef.current = onActivityMessage;
    onChatMessageRef.current = onChatMessage;
    onSharedFileMessageRef.current = onSharedFileMessage;
  }, [
    onWhiteboardMessage,
    onCursorMessage,
    onViewportMessage,
    onPresenterStatusMessage,
    onParticipantLeft,
    onFileMessage,
    onViewportRequestMessage,
    onActivityMessage,
    onChatMessage,
    onSharedFileMessage
  ]);

  // reassembly buffer for incoming chunked images, keyed by fileId.
  const incomingFileChunksRef = useRef<Record<string, { chunks: (string | undefined)[]; total: number }>
  >({});

  const incomingSharedFileChunksRef = useRef<
    Record<
      string,
      {
        meta: Omit<ISharedFile, "dataURL">;
        chunks: (string | undefined)[];
        total: number;
      }
    >
  >({});
  const refreshParticipants = useCallback((room: Room) => {
    setParticipants([room.localParticipant, ...Array.from(room.remoteParticipants.values())]);
  }, []);

  useEffect(() => {
    if (!token || !serverURL) return;

    const room = new Room({
      adaptiveStream: true,
      dynacast: true,
      // by default LiveKit only soft-mutes (track.enabled = false) on mic
      // toggle, which leaves the OS/browser mic recording indicator (and
      // actual hardware capture) ON. This makes mute() stop the underlying
      // MediaStreamTrack so the indicator actually turns off; unmute()
      // transparently re-acquires the mic (getUserMedia) when needed.
      publishDefaults: { stopMicTrackOnMute: true },
    });
    roomRef.current = room;
    setRoom(room);

    room.on(RoomEvent.ConnectionStateChanged, (state) => setConnectionState(state));
    room.on(RoomEvent.ParticipantConnected, () => refreshParticipants(room));

    room.on(RoomEvent.ParticipantDisconnected, (participant) => {
      refreshParticipants(room);
      onParticipantLeftRef.current?.(participant.identity);
    });

    room.on(RoomEvent.TrackSubscribed, () => refreshParticipants(room));
    room.on(RoomEvent.TrackUnsubscribed, () => refreshParticipants(room));
    room.on(RoomEvent.ActiveSpeakersChanged, () => refreshParticipants(room));
    room.on(RoomEvent.LocalTrackPublished, () => refreshParticipants(room));
    room.on(RoomEvent.LocalTrackUnpublished, () => refreshParticipants(room));

    // NOTE: "whiteboard" messages can arrive via either the reliable channel
    // (throttled, guaranteed) or the unreliable channel (fast, best-effort
    // "preview"). Both are handled identically here because
    // reconcileElements() on the receiving side is version-based per
    // element, so it doesn't matter which channel a given snapshot arrived
    // on or whether some preview packets were dropped — the highest
    // version for each element always wins.
    room.on(RoomEvent.DataReceived, (payload: Uint8Array) => {
      try {
        const msg = JSON.parse(new TextDecoder().decode(payload));
        if (msg.type === "whiteboard" && onWhiteboardMessageRef.current) {
          onWhiteboardMessageRef.current(msg.elements);
        } else if (msg.type === "cursor" && onCursorMessageRef.current) {
          onCursorMessageRef.current(msg.cursor as ICursorPosition);
        } else if (msg.type === "viewport" && onViewportMessageRef.current) {
          onViewportMessageRef.current(msg.viewport as IViewportState);
        } else if (msg.type === "presenter-status" && onPresenterStatusMessageRef.current) {
          onPresenterStatusMessageRef.current(msg.status as IPresenterStatus);
        } else if (msg.type === "viewport-request" && onViewportRequestMessageRef.current) {
          onViewportRequestMessageRef.current(msg.requesterIdentity as string);
        } else if (msg.type === "activity" && onActivityMessageRef.current) {
          onActivityMessageRef.current(msg.activity as IActivityPing);
        } else if (msg.type === "chat") {
          onChatMessageRef.current?.(msg.chat);
        } else if (msg.type === "shared-file-chunk") {
          const {
            fileId,
            chunkIndex,
            totalChunks,
            data,
            meta,
          } = msg;

          const buffer = incomingSharedFileChunksRef.current;

          if (!buffer[fileId]) {
            buffer[fileId] = {
              meta,
              total: totalChunks,
              chunks: new Array(totalChunks).fill(undefined),
            };
          }

          buffer[fileId].chunks[chunkIndex] = data;

          const complete =
            buffer[fileId].chunks.every((c) => c !== undefined);

          if (complete) {
            const file: ISharedFile = {
              ...buffer[fileId].meta,
              dataURL: buffer[fileId].chunks.join(""),
            };

            delete buffer[fileId];

            onSharedFileMessageRef.current?.(file);
          }
        } else if (msg.type === "file-chunk") {
          const { fileId, chunkIndex, totalChunks, data } = msg;
          const buf = incomingFileChunksRef.current;

          if (!buf[fileId]) {
            buf[fileId] = { chunks: new Array(totalChunks).fill(undefined), total: totalChunks };
          }
          buf[fileId].chunks[chunkIndex] = data;

          const isComplete = buf[fileId].chunks.every((c) => c !== undefined);
          if (isComplete) {
            const dataURL = buf[fileId].chunks.join("");
            delete buf[fileId];
            onFileMessageRef.current?.({ id: fileId, dataURL });
          }
        }
      } catch {
        // ignore malformed payloads
      }
    });

    room.on(RoomEvent.Disconnected, () => {
      setConnectionState(ConnectionState.Disconnected);
      setParticipants([]);
    });

    (async () => {
      try {
        await room.connect(serverURL, token);
        await room.localParticipant.setMicrophoneEnabled(true);
        setIsMicEnabled(true);
        setLocalParticipant(room.localParticipant);
        refreshParticipants(room);
      } catch (err: any) {
        setError(err?.message ?? "Failed to connect to the study room");
      }
    })();

    return () => {
      room.disconnect();
      roomRef.current = null;
      setRoom(null);
      incomingFileChunksRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, serverURL]);

  const toggleMic = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    const next = !isMicEnabled;
    await room.localParticipant.setMicrophoneEnabled(next);
    setIsMicEnabled(next);
  }, [isMicEnabled]);

  // Reliable, guaranteed-delivery broadcast. Slightly throttled on the
  // caller's side (ExcalidrawBoard) and used as the "source of truth" sync —
  // if any preview packets got dropped, this is what eventually reconciles
  // everyone to the same state.
  const sendWhiteboardElements = useCallback((elements: readonly IWhiteboardElement[]) => {
    const room = roomRef.current;
    if (!room) return;
    room.localParticipant.publishData(
      new TextEncoder().encode(JSON.stringify({ type: "whiteboard", elements })),
      { reliable: true }
    );
  }, []);

  // fast, best-effort broadcast for live drawing feedback. Sent on
  // LiveKit's unreliable data channel, which is a *separate* channel from
  // the reliable/ordered one — so it is never queued behind file-chunk
  // sends or other reliable traffic, and drops are fine because
  // reconcileElements() is version-based (a later, higher-version snapshot
  // — reliable or not — always wins).
  const sendWhiteboardElementsPreview = useCallback(
    (elements: readonly IWhiteboardElement[]) => {
      const room = roomRef.current;
      if (!room) return;
      room.localParticipant.publishData(
        new TextEncoder().encode(JSON.stringify({ type: "whiteboard", elements })),
        { reliable: false }
      );
    },
    []
  );

  const sendCursorPosition = useCallback((x: number, y: number, color: string) => {
    const room = roomRef.current;
    if (!room) return;
    const cursor: ICursorPosition = {
      identity: room.localParticipant.identity,
      name: room.localParticipant.name || room.localParticipant.identity,
      x,
      y,
      color,
    };
    room.localParticipant.publishData(
      new TextEncoder().encode(JSON.stringify({ type: "cursor", cursor })),
      { reliable: false }
    );
  }, []);

  const sendViewportUpdate = useCallback((scrollX: number, scrollY: number, zoom: number) => {
    const room = roomRef.current;
    if (!room) return;
    const viewport: IViewportState = {
      identity: room.localParticipant.identity,
      scrollX,
      scrollY,
      zoom,
    };
    room.localParticipant.publishData(
      new TextEncoder().encode(JSON.stringify({ type: "viewport", viewport })),
      { reliable: false }
    );
  }, []);

  const sendPresenterStatus = useCallback((presenting: boolean) => {
    const room = roomRef.current;
    if (!room) return;
    const status: IPresenterStatus = {
      identity: room.localParticipant.identity,
      name: room.localParticipant.name || room.localParticipant.identity,
      presenting,
    };
    room.localParticipant.publishData(
      new TextEncoder().encode(JSON.stringify({ type: "presenter-status", status })),
      { reliable: true }
    );
  }, []);

  // follower asks whoever is currently presenting to immediately resend
  // their live viewport (unthrottled), instead of relying on the last
  // cached broadcast which may be stale or may not exist yet.
  const sendViewportRequest = useCallback(() => {
    const room = roomRef.current;
    if (!room) return;
    room.localParticipant.publishData(
      new TextEncoder().encode(
        JSON.stringify({
          type: "viewport-request",
          requesterIdentity: room.localParticipant.identity,
        })
      ),
      { reliable: true }
    );
  }, []);

  // best-effort "I'm drawing over here" ping — unreliable channel like cursor
  // position, since a missed ping just means the badge updates on the next
  // one (throttled to 1s on the ExcalidrawBoard side).
  const sendActivityPing = useCallback((scrollX: number, scrollY: number, zoom: number) => {
    const room = roomRef.current;
    if (!room) return;
    const activity: IActivityPing = {
      identity: room.localParticipant.identity,
      name: room.localParticipant.name || room.localParticipant.identity,
      scrollX,
      scrollY,
      zoom,
    };
    room.localParticipant.publishData(
      new TextEncoder().encode(JSON.stringify({ type: "activity", activity })),
      { reliable: false }
    );
  }, []);


  const sendChatMessage = useCallback((chat: IChatMessage) => {
    const room = roomRef.current;
    if (!room) return;

    room.localParticipant.publishData(
      new TextEncoder().encode(
        JSON.stringify({
          type: "chat",
          chat,
        })
      ),
      {
        reliable: true,
      }
    );
  }, []);

 const sendSharedFile = useCallback((file: ISharedFile) => {
  const room = roomRef.current;

  if (!room) return;

  const meta = {
    id: file.id,
    senderId: file.senderId,
    senderName: file.senderName,
    fileName: file.fileName,
    mimeType: file.mimeType,
    size: file.size,
  };

  const totalChunks = Math.ceil(
    file.dataURL.length / FILE_CHUNK_SIZE
  );

  let chunkIndex = 0;

  const sendNext = () => {
    if (chunkIndex >= totalChunks) return;

    room.localParticipant.publishData(
      new TextEncoder().encode(
        JSON.stringify({
          type: "shared-file-chunk",

          fileId: file.id,

          meta,

          chunkIndex,

          totalChunks,

          data: file.dataURL.slice(
            chunkIndex * FILE_CHUNK_SIZE,
            (chunkIndex + 1) * FILE_CHUNK_SIZE
          ),
        })
      ),
      {
        reliable: true,
      }
    );

    chunkIndex++;

    if (chunkIndex < totalChunks) {
      setTimeout(sendNext, FILE_CHUNK_SEND_DELAY_MS);
    }
  };

  sendNext();
}, []);

  // paced chunk sending — image data must not be dropped like cursor/viewport
  // spam is allowed to be (reliable:true), but chunks are spaced out so they
  // don't hog the ordered reliable channel and delay other messages.
  const sendWhiteboardFile = useCallback((file: IWhiteboardFile) => {
    const room = roomRef.current;
    if (!room) return;

    const total = Math.ceil(file.dataURL.length / FILE_CHUNK_SIZE);
    let i = 0;

    const sendNext = () => {
      // bail out if room got disconnected mid-send
      if (roomRef.current !== room || i >= total) return;

      const chunk = file.dataURL.slice(i * FILE_CHUNK_SIZE, (i + 1) * FILE_CHUNK_SIZE);
      room.localParticipant.publishData(
        new TextEncoder().encode(
          JSON.stringify({
            type: "file-chunk",
            fileId: file.id,
            chunkIndex: i,
            totalChunks: total,
            data: chunk,
          })
        ),
        { reliable: true }
      );
      i++;
      if (i < total) setTimeout(sendNext, FILE_CHUNK_SEND_DELAY_MS);
    };

    sendNext();
  }, []);

  const leaveRoom = useCallback(() => {
    roomRef.current?.disconnect();
  }, []);

  const isSpeaking = useCallback((participant: Participant) => participant.isSpeaking, []);

  const getMicTrack = useCallback((participant: Participant) => {
    return participant.getTrackPublication(Track.Source.Microphone);
  }, []);

  return {
    room,
    connectionState,
    participants,
    localParticipant,
    isMicEnabled,
    error,
    toggleMic,
    sendWhiteboardElements,
    sendWhiteboardElementsPreview,
    sendCursorPosition,
    sendViewportUpdate,
    sendPresenterStatus,
    sendWhiteboardFile,
    sendViewportRequest,
    sendActivityPing,
    leaveRoom,
    isSpeaking,
    getMicTrack,
    sendChatMessage,
    sendSharedFile,
  };
}

export type { Participant, RemoteParticipant };