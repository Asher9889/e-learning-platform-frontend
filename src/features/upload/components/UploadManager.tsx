import { useCallback, useEffect, useMemo, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  Upload,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { UploadItem } from "./UploadItem"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { toggleMinimized, removeItem, setStatus } from "../store/upload.slice"
import { getUppy } from "../services/upload-engine"
import { sileo } from "sileo"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function UploadManager() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const items = useAppSelector((s) => s.upload.items)
  const isMinimized = useAppSelector((s) => s.upload.isMinimized)
  const pendingMetadata = useAppSelector((s) => s.upload.pendingMetadata)
  const hasNavigated = useRef(false)

  const activeCount = useMemo(
    () => items.filter((i) => i.status === "UPLOADING" || i.status === "QUEUED" || i.status === "PAUSED").length,
    [items]
  )

  const uploadingItems = useMemo(() => items.filter((i) => i.status === "UPLOADING"), [items])
  const queuedItems = useMemo(() => items.filter((i) => i.status === "QUEUED"), [items])
  const pausedItems = useMemo(() => items.filter((i) => i.status === "PAUSED"), [items])
  const failedItems = useMemo(() => items.filter((i) => i.status === "FAILED"), [items])
  const completedItems = useMemo(
    () => items.filter((i) => i.status === "COMPLETED" || i.status === "CANCELED"),
    [items]
  )

  const totalProgress = useMemo(
    () => items.length
      ? Math.round(items.reduce((sum, i) => sum + i.progress, 0) / items.length)
      : 0,
    [items]
  )

  const totalUploadedBytes = useMemo(
    () => items.reduce((sum, i) => sum + i.uploadedBytes, 0),
    [items]
  )

  const totalFileSize = useMemo(
    () => items.reduce((sum, i) => sum + i.fileSize, 0),
    [items]
  )

  const navigableCount = useMemo(
    () => items.filter((i) => i.status === "COMPLETED" || i.status === "FAILED" || i.status === "CANCELED").length,
    [items]
  )

  // Show a toast when all uploads finish
  useEffect(() => {
    if (
      items.length > 0 &&
      navigableCount === items.length &&
      pendingMetadata.length > 0 &&
      !hasNavigated.current
    ) {
      hasNavigated.current = true
      const completedCount = items.filter((i) => i.status === "COMPLETED").length
      const draftCount = pendingMetadata.filter((p) => p.status === "DRAFT").length
      const publishedCount = pendingMetadata.filter((p) => p.status === "PUBLISHED").length
      sileo.success({
        title: "Upload Complete",
        description: `${completedCount} file${completedCount !== 1 ? "s" : ""} uploaded — ${publishedCount} published, ${draftCount} draft${draftCount !== 1 ? "s" : ""}`,
        duration: 10_000,
        button: {
          title: draftCount > 0 ? "Add Metadata" : "View in Library",
          onClick: () => navigate(draftCount > 0 ? "/content/upload/metadata" : "/content"),
        },
      })
    }
  }, [items, navigableCount, pendingMetadata.length, navigate])

  // Reset navigation flag when new uploads start
  useEffect(() => {
    if (activeCount > 0) {
      hasNavigated.current = false
    }
  }, [activeCount])

  const itemsRef = useRef(items)
  useEffect(() => {
    itemsRef.current = items
  }, [items])

  const handlePauseResume = useCallback((id: string) => {
    getUppy().pauseResume(id)
    dispatch(setStatus({
      id,
      status: itemsRef.current.find((i) => i.id === id)?.status === "PAUSED" ? "UPLOADING" : "PAUSED",
    }))
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

  const handleCloseAll = useCallback(() => {
    itemsRef.current.forEach((i) => {
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
  }, [dispatch])

  if (items.length === 0) return null

  return (
    <div
      role="region"
      aria-label="Upload manager"
      className="fixed bottom-4 right-4 z-50 w-[480px] max-w-[95vw]"
    >
      <Card
        size="sm"
        className={cn(
          "overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-all duration-300",
          isMinimized && "cursor-pointer"
        )}
        onClick={() => {
          if (isMinimized) dispatch(toggleMinimized())
        }}
      >
        <CardHeader
          className={cn(
            "flex flex-row items-center justify-between",
            "border-b bg-muted/50"
          )}
        >
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {activeCount > 0
                ? `Uploading ${activeCount} file${activeCount !== 1 ? "s" : ""}`
                : `Uploads (${items.length})`}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {!isMinimized && items.length > 0 && (
              <span className="text-xs tabular-nums text-muted-foreground">
                {totalProgress}%
              </span>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
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
            {activeCount > 0 ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Close upload panel"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent size="sm">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel all uploads?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {activeCount} upload{activeCount !== 1 ? "s are" : " is"} still running. Cancelling will stop them.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep uploading</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={handleCloseAll}
                    >
                      Yes, cancel all
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCloseAll()
                }}
                aria-label="Dismiss all"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        {/* Minimized: total bytes + progress bar */}
        {isMinimized && items.length > 0 && (
          <div className="px-3 pb-3 pt-1">
            {activeCount > 0 && (
              <p className="mb-1 text-xs text-muted-foreground">
                {formatBytes(totalUploadedBytes)} / {formatBytes(totalFileSize)}
              </p>
            )}
            <Progress value={totalProgress} className="h-2" />
          </div>
        )}

        {/* Expanded content */}
        {!isMinimized && (
          <CardContent className="p-0">
            {/* Aggregate stats bar */}
            {items.length > 0 && (
              <div className="border-b px-3 py-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {formatBytes(totalUploadedBytes)} / {formatBytes(totalFileSize)}
                  </span>
                  <span className="tabular-nums">{totalProgress}%</span>
                </div>
                <Progress value={totalProgress} className="mt-1 h-1.5" />
              </div>
            )}

            <ScrollArea className="max-h-96 overflow-y-auto">
              <div role="list" className="flex flex-col gap-3 p-3">
                {uploadingItems.length > 0 && (
                  <div >
                    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Uploading ({uploadingItems.length})
                    </p>
                    <div className="flex flex-col gap-2">
                      {uploadingItems.map((item) => (
                        <UploadItem
                          key={item.id}
                          item={item}
                          onPause={handlePauseResume}
                          onResume={handlePauseResume}
                          onCancel={handleCancel}
                          onRetry={handleRetry}
                          onRemove={handleRemove}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {queuedItems.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Queued ({queuedItems.length})
                    </p>
                    <div className="flex flex-col gap-2">
                      {queuedItems.map((item) => (
                        <UploadItem
                          key={item.id}
                          item={item}
                          onPause={handlePauseResume}
                          onResume={handlePauseResume}
                          onCancel={handleCancel}
                          onRetry={handleRetry}
                          onRemove={handleRemove}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {pausedItems.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Paused ({pausedItems.length})
                    </p>
                    <div className="flex flex-col gap-2">
                      {pausedItems.map((item) => (
                        <UploadItem
                          key={item.id}
                          item={item}
                          onPause={handlePauseResume}
                          onResume={handlePauseResume}
                          onCancel={handleCancel}
                          onRetry={handleRetry}
                          onRemove={handleRemove}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {failedItems.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-destructive">
                      Failed ({failedItems.length})
                    </p>
                    <div className="flex flex-col gap-2">
                      {failedItems.map((item) => (
                        <UploadItem
                          key={item.id}
                          item={item}
                          onPause={handlePauseResume}
                          onResume={handlePauseResume}
                          onCancel={handleCancel}
                          onRetry={handleRetry}
                          onRemove={handleRemove}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {completedItems.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Completed ({completedItems.length})
                    </p>
                    <div className="flex flex-col gap-2">
                      {completedItems.map((item) => (
                        <UploadItem
                          key={item.id}
                          item={item}
                          onPause={handlePauseResume}
                          onResume={handlePauseResume}
                          onCancel={handleCancel}
                          onRetry={handleRetry}
                          onRemove={handleRemove}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>

          </CardContent>
        )}

      </Card>
    </div>
  )
}
