import { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreHorizontal, Pencil, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMaterial } from "@/features/content/hooks/useGetMaterial";
import { getMaterialFileUrl } from "@/components/material-preview/MaterialPreview";
import { OverviewTab } from "@/features/content/components/OverviewTab";
import { AISummaryTab } from "@/features/content/components/AISummaryTab";
import { TranscriptTab } from "@/features/content/components/TranscriptTab";

const TYPE_LABELS: Record<string, string> = {
  VIDEO: "Recorded Class",
  PDF: "PDF Document",
  DOCUMENT: "Document",
  IMAGE: "Image",
  AUDIO: "Audio",
};

export default function ContentDetailsPage() {
  const { materialId } = useParams<{ materialId: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const { data, isLoading, error } = useGetMaterial(materialId || "");

  const material = data?.data;

  const handleSeek = (timeMs: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timeMs / 1000;
      videoRef.current.play();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/content")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="aspect-video w-full rounded-xl" />
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  // Error / not found
  if (error || !material) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-base font-semibold text-foreground">Material not found</p>
        <p className="text-sm text-muted-foreground">
          The content you're looking for doesn't exist or has been removed.
        </p>
        <Button variant="outline" onClick={() => navigate("/content")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Content Library
        </Button>
      </div>
    );
  }

  const fileUrl = getMaterialFileUrl(material.objectKey);

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="mt-0.5"
            onClick={() => navigate("/content")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight md:text-2xl">
              {material.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="font-normal">
                {TYPE_LABELS[material.materialType] || material.materialType}
              </Badge>
              <span>&middot;</span>
              <span>{material.subject || "No subject"}</span>
              <span>&middot;</span>
              <span>{material.createdBy.name}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <MoreHorizontal className="h-4 w-4" />
              More
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate AI
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Sparkles className="mr-2 h-4 w-4" />
              AI Summary
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Media Player */}
      <div className="overflow-hidden rounded-xl bg-black">
        {material.materialType === "VIDEO" && (
          <video
            ref={videoRef}
            controls
            className="aspect-video w-full"
          >
            <source src={fileUrl} type={material.file.mimeType} />
            Your browser does not support the video element.
          </video>
        )}

        {material.materialType === "AUDIO" && (
          <div className="flex aspect-[21/9] items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800 p-8">
            <audio ref={videoRef as React.RefObject<HTMLAudioElement>} controls className="w-full max-w-lg">
              <source src={fileUrl} type={material.file.mimeType} />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {material.materialType === "PDF" && (
          <iframe
            src={fileUrl}
            className="aspect-video w-full border-0"
            title={material.title}
          />
        )}

        {material.materialType === "IMAGE" && (
          <div className="flex aspect-video items-center justify-center bg-zinc-900 p-4">
            <img
              src={fileUrl}
              alt={material.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}

        {material.materialType === "DOCUMENT" && (
          <div className="flex aspect-video flex-col items-center justify-center gap-3 bg-zinc-900 text-zinc-400">
            <p className="text-sm">Preview not available for this file type.</p>
            <Button variant="outline" size="sm" asChild>
              <a href={fileUrl} download target="_blank" rel="noopener noreferrer">
                Download File
              </a>
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-summary" className="gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            AI Summary
          </TabsTrigger>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview" className="mt-0">
            <OverviewTab material={material} />
          </TabsContent>

          <TabsContent value="ai-summary" className="mt-0">
            <AISummaryTab onSeek={handleSeek} />
          </TabsContent>

          <TabsContent value="transcript" className="mt-0">
            <TranscriptTab onSeek={handleSeek} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
