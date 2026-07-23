"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { Profile } from "@africasuk/types";

import ProfileCard from "./ProfileCard";
import EditProfileDialog from "./EditProfileDialog";
import ChangeAvatarDialog from "./ChangeAvatarDialog";

interface Props {
  profile: Profile;
}

export default function ProfileSection({
  profile,
}: Props) {
  const router = useRouter();

  const [, startTransition] =
    useTransition();

  const [editOpen, setEditOpen] =
    useState(false);

  const [
    avatarOpen,
    setAvatarOpen,
  ] = useState(false);

  function refreshProfile() {
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <>
      <ProfileCard
        profile={profile}
        onEdit={() =>
          setEditOpen(true)
        }
        onChangeAvatar={() =>
          setAvatarOpen(true)
        }
      />

      <EditProfileDialog
        open={editOpen}
        profile={profile}
        onOpenChange={
          setEditOpen
        }
        onSuccess={refreshProfile}
      />

      <ChangeAvatarDialog
        open={avatarOpen}
        profile={profile}
        onOpenChange={
          setAvatarOpen
        }
        onSuccess={refreshProfile}
      />
    </>
  );
}