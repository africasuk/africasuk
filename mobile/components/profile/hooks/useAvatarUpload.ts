import { useState } from "react";
import { Alert } from "react-native";

import { createClient } from "@/lib/auth/client";
import { ProfileRepository } from "@africasuk/database";

export type UploadStatus =
  | "idle"
  | "preparing"
  | "uploading"
  | "saving"
  | "success"
  | "error";

export interface MobileSelectedFile {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

export function useAvatarUpload(userId: string) {
  const supabase = createClient();

  const [file, setFile] = useState<MobileSelectedFile | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [uploading, setUploading] = useState(false);

  function selectFile(selected: MobileSelectedFile) {
    if (selected.type && !selected.type.startsWith("image/")) {
      Alert.alert("Invalid File", "Please choose an image.");
      return;
    }

    if (selected.size && selected.size > 5 * 1024 * 1024) {
      Alert.alert("File Too Large", "Image must be smaller than 5 MB.");
      return;
    }

    setFile(selected);
    setPreview(selected.uri);
    setStatus("idle");
  }

  function clear() {
    setFile(null);
    setPreview(null);
    setStatus("idle");
  }

  async function upload(): Promise<string | null> {
    if (!file) {
      Alert.alert("Selection Required", "Please select an image first.");
      return null;
    }

    setUploading(true);

    try {
      setStatus("preparing");

      const extension = file.name.split(".").pop() ?? "jpg";
      const fileName = `${Date.now()}.${extension}`;
      const path = `${userId}/${fileName}`;

      // Convert local file URI to ArrayBuffer natively using fetch
      const response = await fetch(file.uri);
      const arrayBuffer = await response.arrayBuffer();

      setStatus("uploading");

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, arrayBuffer, {
          contentType: file.type || "image/jpeg",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrl } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      setStatus("saving");

      await ProfileRepository.update(supabase, userId, {
        avatarUrl: publicUrl.publicUrl,
      });

      setStatus("success");
      Alert.alert("Success", "Profile picture updated successfully.");

      return publicUrl.publicUrl;
    } catch (error) {
      setStatus("error");
      console.error("Avatar upload failed:", error);
      Alert.alert(
        "Upload Failed",
        error instanceof Error ? error.message : "Failed to upload avatar."
      );
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