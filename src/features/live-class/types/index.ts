import type { TrackReference } from "@livekit/components-react";

export type ParticipantRole = "teacher" | "student";

export interface ParticipantInfo {
  identity: string;
  name: string;
  avatar?: string;
  role: ParticipantRole;
  isMuted: boolean;
  isCameraOff: boolean;
  handRaised: boolean;
  isSpeaking: boolean;
  isPinned?: boolean;
}

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

export interface TeacherTrackReferences {
  cameraTracks: TrackReference[];
  screenShareTracks: TrackReference[];
}

export interface StudentTrackReferences {
  cameraTracks: TrackReference[];
}
