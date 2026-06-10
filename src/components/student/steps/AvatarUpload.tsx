"use client";

import { useEffect, useState } from "react";
import {
  formatBytes,
  useFileUpload,
  type FileWithPreview,
} from "@/hooks/use-file-upload";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  UserIcon,
  XIcon,
} from "lucide-react";

interface AvatarUploadProps {
  maxSize?: number;
  className?: string;
  onFileChange?: (
    file: FileWithPreview | null
  ) => void;
  defaultAvatar?: string;

  // NEW
  value?: File | string;
}

export function AvatarUpload({
  maxSize = 2 * 1024 * 1024,
  className,
  onFileChange,
  defaultAvatar,
  value,
}: AvatarUploadProps) {
  const [formPreview, setFormPreview] = useState<string>("");

  const [
    { files, isDragging },
    {
      removeFile,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles: 1,
    maxSize,
    accept: "image/*",
    multiple: false,
    onFilesChange: (files) => {
      onFileChange?.(
        files[0] || null
      );
    },
  });

  useEffect(() => {
    if (!value) {
      setFormPreview("");
      return;
    }

    if (value instanceof File) {
      const url =
        URL.createObjectURL(value);

      setFormPreview(url);

      return () =>
        URL.revokeObjectURL(url);
    }

    if (typeof value === "string") {
      setFormPreview(value);
    }
  }, [value]);

  const currentFile = files[0];

  const previewUrl =
    currentFile?.preview ||
    formPreview ||
    defaultAvatar;

  const handleRemove = () => {
    if (currentFile) {
      removeFile(currentFile.id);
    }

    setFormPreview("");
    onFileChange?.(null);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4",
        className
      )}
    >
      <div className="relative">
        <div
          className={cn(
            "group/avatar relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border border-dashed transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/20",
            previewUrl &&
              "border-solid"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            {...getInputProps()}
            className="sr-only"
          />

          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <UserIcon className="text-muted-foreground size-6" />
            </div>
          )}
        </div>

        {previewUrl && (
          <Button
            size="icon"
            variant="outline"
            onClick={handleRemove}
            className="absolute end-0.5 top-0.5 z-10 size-6 rounded-full"
            aria-label="Remove avatar"
            type="button"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}
      </div>

      <div className="space-y-0.5 text-center">
        <p className="text-sm font-medium">
          {previewUrl
            ? "Avatar uploaded"
            : "Upload avatar"}
        </p>

        <p className="text-muted-foreground text-xs">
          PNG, JPG up to{" "}
          {formatBytes(maxSize)}
        </p>
      </div>
    </div>
  );
}