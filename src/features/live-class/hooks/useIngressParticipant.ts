import { useEffect } from "react";
import { useParticipants } from "@livekit/components-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPresenter } from "@/features/live-class/store/liveClass.slice";

/**
 * Watches LiveKit participants for an ingress service (REPLAY).
 *
 * When deliveryMode is REPLAY, the presenter is initially set with identity: null.
 * This hook scans participants for one whose metadata contains type: "REPLAY",
 * extracts its identity, and updates the presenter in Redux.
 */
export function useIngressParticipant() {
  const participants = useParticipants();
  const dispatch = useAppDispatch();
  const presenter = useAppSelector((s) => s.liveClass.presenter);

  useEffect(() => {
    if (presenter?.type !== "REPLAY" || presenter?.identity) return;

    const ingressParticipant = participants.find((p) => {
      try {
        if (!p.metadata) return false;
        const meta = JSON.parse(p.metadata);
        return meta.type === "REPLAY";
      } catch {
        return false;
      }
    });

    if (ingressParticipant) {
      console.log("Found ingress participant:", ingressParticipant);
      dispatch(setPresenter({
        identity: ingressParticipant.identity,
        type: "REPLAY",
        name: ingressParticipant.name || "Replay Session",
      }));
    }
  }, [participants, presenter?.type, presenter?.identity, dispatch]);
}
