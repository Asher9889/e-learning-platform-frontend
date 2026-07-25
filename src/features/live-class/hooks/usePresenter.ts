import { useAppSelector } from "@/store/hooks";
import type { PresenterIdentity } from "../types";

/**
 * Returns the current presenter — the participant occupying the main stage.
 *
 * This is the single source of truth for stage rendering.
 * The presenter is initially always the teacher. In the future,
 * it may be switched to a REPLAY ingress participant.
 *
 * For teacher-specific operations (permissions, moderation, controls),
 * continue using `teacherIdentity` from the store directly.
 */
export function usePresenter(): PresenterIdentity | null {
  return useAppSelector((state) => state.liveClass.presenter);
}
