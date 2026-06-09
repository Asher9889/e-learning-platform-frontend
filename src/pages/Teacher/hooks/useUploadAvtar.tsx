// src/pages/Teacher/hooks/useUploadAvatar.ts

import { useMutation } from "@tanstack/react-query";
import { uploadAvatar } from "../api/upload-avatar.api";

export function useUploadAvatar() {
  const mutation = useMutation({
    mutationKey: ["upload-avatar"],

    mutationFn: (file: File | string) =>
      uploadAvatar(file),

    onSuccess: (data) => {
      console.log(
        "Avatar uploaded successfully",
        data
      );
    },

    onError: (error) => {
      console.error(
        "Avatar upload failed",
        error
      );
    },
  });

  return {
    uploadAvatar: mutation.mutate,
    uploadAvatarAsync:
      mutation.mutateAsync,

    isUploading:
      mutation.isPending,

    uploadError:
      mutation.error,

    uploadedAvatar:
      mutation.data,
  };
}