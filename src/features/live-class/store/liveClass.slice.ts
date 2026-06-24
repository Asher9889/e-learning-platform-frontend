import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ChatMessage, ChatTab, ITeacherIdentity } from "../types";
import type { TUserRole } from "@/constants/user/user.constant";

interface LiveClassState {
  roomName: string | null;
  isConnected: boolean;
  chatOpen: boolean;
  participantsOpen: boolean;
  activeTab: ChatTab;
  handRaised: boolean;
  messages: ChatMessage[];
  isRecording: boolean;
  participantRole: TUserRole | null;
  participantIdentity: string | null;
  teacherIdentity: ITeacherIdentity | null;
  participantCount: number;
  classId: string | null;
}

const initialState: LiveClassState = {
  roomName: null,
  isConnected: false,
  chatOpen: true,
  participantsOpen: true,
  activeTab: "chat",
  handRaised: false,
  messages: [],
  isRecording: false,
  participantRole: null,
  participantIdentity: null,
  teacherIdentity: null,
  participantCount: 0,
  classId: null,
};
 
const liveClassSlice = createSlice({
  name: "liveClass",
  initialState,
  reducers: {
    setRoomName(state, action: PayloadAction<string>) {
      state.roomName = action.payload;
    },
    setConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
    toggleChat(state) {
      state.chatOpen = !state.chatOpen;
    },
    setChatOpen(state, action: PayloadAction<boolean>) {
      state.chatOpen = action.payload;
    },
    toggleParticipants(state) {
      state.participantsOpen = !state.participantsOpen;
    },
    setParticipantsOpen(state, action: PayloadAction<boolean>) {
      state.participantsOpen = action.payload;
    },
    setActiveTab(state, action: PayloadAction<ChatTab>) {
      state.activeTab = action.payload;
    },
    setHandRaised(state, action: PayloadAction<boolean>) {
      state.handRaised = action.payload;
    },
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },
    setRecording(state, action: PayloadAction<boolean>) {
      state.isRecording = action.payload;
    },
    setParticipantRole(
      state,
      action: PayloadAction<TUserRole | null>
    ) {
      state.participantRole = action.payload;
    },
    setParticipantIdentity(state, action: PayloadAction<string | null>) {
      state.participantIdentity = action.payload;
    },
    setTeacherIdentity(state, action: PayloadAction<ITeacherIdentity>) {
      state.teacherIdentity = action.payload;  
    },
    setClassId(state, action: PayloadAction<string>) {
      state.classId = action.payload;
    },
    setParticipantCount(state, action: PayloadAction<number>) {
      state.participantCount = action.payload;
    },
    resetClassroom() {
      return initialState;
    },
  },
});

export const {
  setRoomName,
  setConnected,
  toggleChat,
  setChatOpen,
  toggleParticipants,
  setParticipantsOpen,
  setActiveTab,
  setHandRaised,
  addMessage,
  setRecording,
  setParticipantRole,
  setParticipantIdentity,
  setTeacherIdentity,
  setClassId,
  setParticipantCount,
  resetClassroom,
} = liveClassSlice.actions;

// export default liveClassSlice.reducer;
