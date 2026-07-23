"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { createClient } from "@/lib/auth/client";

import { ProfileRepository } from "@africasuk/database";

type UploadStatus =
  | "idle"
  | "preparing"
  | "uploading"
  | "saving"
  | "success"
  | "error";

export function useAvatarUpload(
  userId: string
) {
  const supabase = createClient();

  const [file, setFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState<string | null>(null);

  const [status, setStatus] =
    useState<UploadStatus>("idle");

  const [uploading, setUploading] =
    useState(false);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function selectFile(
    selected: File
  ) {
    if (
      !selected.type.startsWith(
        "image/"
      )
    ) {
      toast.error(
        "Please choose an image."
      );
      return;
    }

    if (
      selected.size >
      5 * 1024 * 1024
    ) {
      toast.error(
        "Image must be smaller than 5 MB."
      );
      return;
    }

    if (preview) {
      URL.revokeObjectURL(
        preview
      );
    }

    setFile(selected);

    setPreview(
      URL.createObjectURL(
        selected
      )
    );

    setStatus("idle");
  }

  function clear() {
    if (preview) {
      URL.revokeObjectURL(
        preview
      );
    }

    setFile(null);
    setPreview(null);
    setStatus("idle");
  }

  async function upload() {
    if (!file) {
      throw new Error(
        "Please select an image."
      );
    }

    setUploading(true);

    try {
      setStatus(
        "preparing"
      );

      const extension =
        file.name
          .split(".")
          .pop() ?? "jpg";

      const fileName =
        `${Date.now()}.${extension}`;

      const path =
        `${userId}/${fileName}`;

      setStatus(
        "uploading"
      );

      const {
        error: uploadError,
      } =
        await supabase.storage
          .from("avatars")
          .upload(path, file, {
            upsert: true,
          });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: publicUrl,
      } =
        supabase.storage
          .from("avatars")
          .getPublicUrl(path);

      setStatus(
        "saving"
      );

      await ProfileRepository.update(
        supabase,
        userId,
        {
          avatarUrl:
            publicUrl.publicUrl,
        }
      );

      setStatus(
        "success"
      );

      toast.success(
        "Profile picture updated."
      );

      return publicUrl.publicUrl;
    } catch (error) {
      setStatus("error");

      throw error;
    } finally {
      setUploading(false);
    }
  }

  return {
    file,
    preview,

    uploading,

    status,

    selectFile,
    clear,
    upload,
  };
}