import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { UploadItem, UploadStatus } from "../types/upload.types"

export interface PendingMetadataItem {
  fileId: string
  fileName: string
  fileSize: number
  uploadUrl: string
}

interface UploadState {
  items: UploadItem[]
  pendingMetadata: PendingMetadataItem[]
  isMinimized: boolean
}

const initialState: UploadState = {
  items: [],
  pendingMetadata: [],
  isMinimized: false,
}

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    addUpload(
      state,
      action: PayloadAction<{
        id: string
        fileName: string
        fileSize: number
      }>
    ) {
      state.items.push({
        id: action.payload.id,
        fileName: action.payload.fileName,
        fileSize: action.payload.fileSize,
        uploadedBytes: 0,
        progress: 0,
        status: "QUEUED",
      })
    },

    updateProgress(
      state,
      action: PayloadAction<{
        id: string
        uploadedBytes: number
        progress: number
        speed?: number
        eta?: number
      }>
    ) {
      const item = state.items.find((i) => i.id === action.payload.id)
      if (item) {
        item.uploadedBytes = action.payload.uploadedBytes
        item.progress = action.payload.progress
        item.speed = action.payload.speed
        item.eta = action.payload.eta
      }
    },

    setStatus(
      state,
      action: PayloadAction<{
        id?: string
        status: UploadStatus
        error?: string
      }>
    ) {
      console.log("[REDUX SETSTATUS] Updating status for", action.payload.id, "to", action.payload.status);
      const item = state.items.find((i) => i.id === action.payload.id)
      if (item) {
        item.status = action.payload.status
        item.error = action.payload.error
        if (action.payload.status === "COMPLETED") {
          item.progress = 100
          item.uploadedBytes = item.fileSize
        }
      }
    },

    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload)
    },

    clearCompleted(state) {
      state.items = state.items.filter(
        (i) =>
          i.status !== "COMPLETED" &&
          i.status !== "CANCELED" &&
          i.status !== "FAILED"
      )
    },

    toggleMinimized(state) {
      state.isMinimized = !state.isMinimized
    },

    addPendingMetadata(state, action: PayloadAction<PendingMetadataItem>) {
      const exists = state.pendingMetadata.find(
        (p) => p.fileId === action.payload.fileId
      )
      if (!exists) {
        state.pendingMetadata.push(action.payload)
      }
    },

    removePendingMetadata(state, action: PayloadAction<string>) {
      state.pendingMetadata = state.pendingMetadata.filter(
        (p) => p.fileId !== action.payload
      )
    },

    clearPendingMetadata(state) {
      state.pendingMetadata = []
    },
  },
})

export const {
  addUpload,
  updateProgress,
  setStatus,
  removeItem,
  clearCompleted,
  toggleMinimized,
  addPendingMetadata,
  removePendingMetadata,
  clearPendingMetadata,
} = uploadSlice.actions

export default uploadSlice.reducer
