export const ROOM_STATUS = {
  ACTIVE: "ACTIVE",
  LIVE: "LIVE",
  ENDED: "ENDED",
} as const;
export type TRoomStatus = (typeof ROOM_STATUS)[keyof typeof ROOM_STATUS];

export const ROOM_MEMBER_ROLE = {
  CREATOR: "CREATOR",
  MEMBER: "MEMBER",
} as const;
export type TRoomMemberRole = (typeof ROOM_MEMBER_ROLE)[keyof typeof ROOM_MEMBER_ROLE];

export const ROOM_FILTER = {
  ALL: "ALL",
  MY_ROOMS: "MY_ROOMS",
  JOINED: "JOINED",
  LIVE: "LIVE",
} as const;
export type TRoomFilter = (typeof ROOM_FILTER)[keyof typeof ROOM_FILTER];

export interface IPopulatedUser {
  _id: string;
  personalInfo: {
    name: string;
    profileImage?: string;
  };
}

export interface IRoomMember {
  user: IPopulatedUser;
  role: TRoomMemberRole;
  joinedAt: string;
}

export interface IGroupStudyRoom {
  _id: string;
  id?: string;
  name: string;
  description: string | null;
  subject: string | null;
  createdBy: IPopulatedUser;
  isPrivate: boolean;
  status: TRoomStatus;
  roomName: string;
  members: IRoomMember[];
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IGroupStudyRoomsResponse {
  rooms: IGroupStudyRoom[];
  pagination: IPagination;
}

export interface IGroupStudyStats {
  totalRooms: number;
  liveRooms: number;
  totalMembers: number;
  avgMembers: number;
}

export interface ILiveKitJoinData {
  room: {
    id: string;
    roomName: string;
    name: string;
    status: TRoomStatus;
  };
  liveKit: {
    token: string;
    roomName: string;
    serverURL: string;
  };
}
