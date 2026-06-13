import { useCallback, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  Upload,
  ChevronDown,
  ChevronUp,
  X,
  FileUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { UploadItem } from "./UploadItem"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { toggleMinimized, removeItem } from "../store/upload.slice"
import { getUppy } from "../services/upload-engine"

export function UploadManager() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { items, isMinimized, pendingMetadata } = useAppSelector((s) => s.upload)
  const hasNavigated = useRef(false)

  const activeCount = items.filter(
    (i) => i.status === "UPLOADING" || i.status === "QUEUED" || i.status === "PAUSED"
  ).length
  const totalProgress = items.length
    ? Math.round(items.reduce((sum, i) => sum + i.progress, 0) / items.length)
    : 0
  const visibleItems = items.filter(
    (i) => i.status !== "COMPLETED" && i.status !== "CANCELED"
  )

  const handlePause = useCallback((id: string) => {
    getUppy().pauseResume(id)
  }, [])

  const handleResume = useCallback((id: string) => {
    getUppy().pauseResume(id)
  }, [])

  const handleCancel = useCallback((id: string) => {
    getUppy().removeFile(id)
  }, [])

  const handleRetry = useCallback((id: string) => {
    getUppy().retryUpload(id)
  }, [])

  const handleRemove = useCallback(
    (id: string) => {
      dispatch(removeItem(id))
    },
    [dispatch]
  )

  const navigableCount = items.filter(
    (i) => i.status === "COMPLETED" || i.status === "FAILED" || i.status === "CANCELED"
  ).length

  useEffect(() => {
    if (
      items.length > 0 &&
      navigableCount === items.length &&
      pendingMetadata.length > 0 &&
      !hasNavigated.current
    ) {
      hasNavigated.current = true
      navigate("/content/upload/metadata")
    }
  }, [items.length, navigableCount, pendingMetadata.length, navigate])

  // Reset navigation flag when new uploads start
  useEffect(() => {
    if (activeCount > 0) {
      hasNavigated.current = false
    }
  }, [activeCount])

  if (items.length === 0) return null

  return (
    <div
      role="region"
      aria-label="Upload manager"
      className="fixed bottom-4 right-4 z-50 w-[400px] max-w-[calc(100vw-2rem)]"
    >
      <Card
        className={cn(
          "border shadow-lg transition-all duration-300",
          isMinimized && "cursor-pointer"
        )}
        onClick={() => {
          if (isMinimized) dispatch(toggleMinimized())
        }}
      >
        {/* Header */}
        <CardHeader
          className={cn(
            "flex flex-row items-center justify-between p-3",
            "border-b bg-muted/30"
          )}
        >
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              Uploads{activeCount > 0 ? ` (${activeCount})` : ""}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {!isMinimized && activeCount > 0 && (
              <span className="text-xs tabular-nums text-muted-foreground">
                {totalProgress}%
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation()
                dispatch(toggleMinimized())
              }}
              aria-label={
                isMinimized ? "Expand upload panel" : "Minimize upload panel"
              }
            >
              {isMinimized ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => {
                items.forEach((i) => {
                  if (
                    i.status === "UPLOADING" ||
                    i.status === "QUEUED" ||
                    i.status === "PAUSED"
                  ) {
                    getUppy().removeFile(i.id)
                  } else {
                    dispatch(removeItem(i.id))
                  }
                })
              }}
              aria-label="Close upload panel"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Minimized: just show progress bar */}
        {isMinimized && activeCount > 0 && (
          <div className="px-3 pb-3 pt-1">
            <Progress value={totalProgress} className="h-1.5" />
          </div>
        )}

        {/* Expanded content */}
        {!isMinimized && (
          <CardContent className="p-0">
            {visibleItems.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
                <FileUp className="h-8 w-8" />
                <p>No active uploads</p>
              </div>
            ) : (
              <ScrollArea className="max-h-80">
                <div role="list" className="space-y-2 p-3">
                  {visibleItems.map((item) => (
                    <UploadItem
                      key={item.id}
                      item={item}
                      onPause={handlePause}
                      onResume={handleResume}
                      onCancel={handleCancel}
                      onRetry={handleRetry}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}
