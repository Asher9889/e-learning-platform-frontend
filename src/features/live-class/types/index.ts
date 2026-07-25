import type { TrackReference } from "@livekit/components-react";

// ─── Presenter Domain ────────────────────────────────────────────────────────
// The presenter is the participant currently occupying the main stage.
// Initially only TEACHER is supported. REPLAY will be added later.

export type PresenterType = "TEACHER";

export interface PresenterIdentity {
  /** LiveKit participant identity (the id used to match tracks) */
  identity: string;
  /** The kind of presenter — controls stage behaviour and future extension */
  type: PresenterType;
  /** Display name shown on the stage and audio-only card */
  name: string;
  /** Optional avatar shown in audio-only state */
  profileImage?: string;
}

// ─── Participant / Role ──────────────────────────────────────────────────────

export type ParticipantRole = "TEACHER" | "STUDENT";

export interface ParticipantInfo {
  identity: string;
  name: string;
  avatar?: string;
  role: ParticipantRole;
  isMuted: boolean;
  isCameraOff: boolean;
  handRaised: boolean;
  isPinned?: boolean;
  audioLevel?: number;
  isSpeaking?: boolean;
}

// ─── Chat ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: number;
  type: "message" | "question" | "announcement";
}

export type ConnectionQuality = "excellent" | "good" | "poor" | "disconnected";

export type ChatTab = "chat" | "qa" | "announcements";

// ─── Connection ──────────────────────────────────────────────────────────────

export interface LiveKitConnectionParams {
  token: string;
  serverUrl: string;
  roomName: string;
}

export interface RoomMediaState {
  isMuted: boolean;
  isCameraOn: boolean;
  isScreenSharing: boolean;
}

// ─── Track References ────────────────────────────────────────────────────────

export interface TeacherTrackReferences {
  cameraTracks: TrackReference[];
  screenShareTracks: TrackReference[];
}

export interface StudentTrackReferences {
  cameraTracks: TrackReference[];
}

// ─── Legacy (kept for permissions / moderation) ──────────────────────────────

export interface ITeacherIdentity {
  id: string;
  name: string;
  profileImage?: string;
}
