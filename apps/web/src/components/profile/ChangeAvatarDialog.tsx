"use client";

import type { Profile } from "@africasuk/types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AvatarUploader from "./AvatarUploader";

interface Props {
  open: boolean;
  profile: Profile;
  onOpenChange(
    open: boolean
  ): void;
  onSuccess?(): void | Promise<void>;
}

export default function ChangeAvatarDialog({
  open,
  profile,
  onOpenChange,
  onSuccess,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          onOpenChange(false);
        }
      }}
    >
      <DialogContent
        className="max-w-lg"
        onPointerDownOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            Change Profile Picture
          </DialogTitle>

          <DialogDescription>
            Upload a new profile picture.
            Supported formats are JPG,
            PNG and WEBP (maximum 5 MB).
          </DialogDescription>
        </DialogHeader>

        <AvatarUploader
          userId={profile.userId}
          currentAvatar={
            profile.avatarUrl
          }
          onUploaded={async () => {
            await Promise.resolve(
              onSuccess?.()
            );

            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}