"use client";

import Image from "next/image";
import { Camera, Loader2, Trash2, User } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useAvatarUpload } from "./hooks/useAvatarUpload";

interface Props {
  userId: string;
  currentAvatar: string | null;
  onUploaded?(url: string): void | Promise<void>;
}

export default function AvatarUploader({
  userId,
  currentAvatar,
  onUploaded,
}: Props) {
  const {
    file,
    preview,
    uploading,
    status,
    selectFile,
    clear,
    upload,
  } = useAvatarUpload(userId);

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  async function handleUpload() {
    const url = await upload();

    if (url) {
      await Promise.resolve(
        onUploaded?.(url)
      );
    }
  }

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) =>
          e.preventDefault()
        }
        onDrop={(e) => {
          e.preventDefault();

          const selected =
            e.dataTransfer.files?.[0];

          if (selected) {
            selectFile(selected);
          }
        }}
        className="rounded-2xl border-2 border-dashed p-6"
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-5 h-36 w-36 overflow-hidden rounded-full border">
            {preview ||
            currentAvatar ? (
              <Image
                src={
                  preview ??
                  currentAvatar!
                }
                alt="Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <User className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
          </div>

          <h3 className="font-semibold">
            Profile Picture
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Drag & drop an image here or
            choose one from your device.
          </p>

          <input
            hidden
            id="avatar-input"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const selected =
                e.target.files?.[0];

              if (selected) {
                selectFile(
                  selected
                );
              }
            }}
          />

          <label
            htmlFor="avatar-input"
            className="mt-5"
          >
            <Button
              asChild
              type="button"
              variant="outline"
            >
              <span>
                <Camera className="mr-2 h-4 w-4" />
                Choose Image
              </span>
            </Button>
          </label>
        </div>
      </div>

      {file && (
        <div className="rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {file.name}
              </p>

              <p className="text-sm text-muted-foreground">
                {formatSize(
                  file.size
                )}
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              disabled={
                uploading
              }
              onClick={clear}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      )}

      {uploading && (
        <div className="rounded-xl border bg-muted/30 p-4">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />

            <div>
              <p className="font-medium">
                {status ===
                  "preparing" &&
                  "Preparing image..."}

                {status ===
                  "uploading" &&
                  "Uploading image..."}

                {status ===
                  "saving" &&
                  "Saving profile..."}

                {status ===
                  "success" &&
                  "Finished"}
              </p>

              <p className="text-sm text-muted-foreground">
                Please don&apos;t close this
                window.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={clear}
        >
          Remove
        </Button>

        <Button
          type="button"
          disabled={
            !file || uploading
          }
          onClick={() => {
            void handleUpload();
          }}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Save Profile Picture"
          )}
        </Button>
      </div>
    </div>
  );
}