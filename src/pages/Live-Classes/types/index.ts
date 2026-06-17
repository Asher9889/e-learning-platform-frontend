import type { TClassStatus } from "@/constants/live-class/live-class.constants";


export interface IBaseApiResponse<TData> {
  success: boolean;
  statusCode: number;
  message: string;
  data: TData;
  errors: string[];
}

export interface ILiveSessionSubject {
  id: string;
  name: string;
}

export interface ILiveSessionTeacher {
  id: string;
  name: string;
  profileImage?: string;
}

export interface ILiveSessionProgram {
  id: string;
  name: string;
}

export interface ILiveSessionBatch {
  id: string;
  name: string;
}

export interface ILiveSessionCreatedBy {
  id: string;
  name: string;
  profileImage?: string;
}

export interface ILiveSession {
  id: string;

  title: string;
  description: string | null;

  program?: ILiveSessionProgram;
  batch?: ILiveSessionBatch | null;
  subject: ILiveSessionSubject;
  teacher: ILiveSessionTeacher;
  createdBy: ILiveSessionCreatedBy;

  status: TClassStatus;

  roomName: string | null;

  durationMinutes: number;
  maxParticipants: number;

  isRecordingEnabled: boolean;
  isChatEnabled: boolean;
  isScreenShareAllowed: boolean;

  scheduledAt: string | null;
  startedAt: string | null;
  endedAt: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface IActiveLiveSession extends ILiveSession {}


export interface IUpcomingLiveClassesResponse {
  sessions: ILiveSession[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
}

export interface LiveClassFilters {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  teacherId?: string;
  subjectId?: string;
}

export interface IJoinLiveClassResponse {
  liveClass: {
    id: string,
    roomName: string,
    participantName: string,
    participantId: string,
    participantRole: string
  },
  liveKit: {
    token: string,
    roomName: string,
    serverURL: string,
  },
}