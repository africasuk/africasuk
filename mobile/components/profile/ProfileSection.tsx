import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import type { Profile } from "@africasuk/types";

import ProfileCard from "./ProfileCard";
import EditProfileModal from "./EditProfileModal";
import ChangeAvatarModal from "./ChangeAvatarModal";

interface Props {
  profile: Profile;
  onRefresh?: () => void;
}

export default function ProfileSection({ profile, onRefresh }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  function handleSuccess() {
    onRefresh?.();
  }

  return (
    <View style={styles.container}>
      {/* Profile Info Card */}
      <ProfileCard
        profile={profile}
        onEdit={() => setEditOpen(true)}
        onChangeAvatar={() => setAvatarOpen(true)}
      />

      {/* Edit Profile Modal Sheet */}
      <EditProfileModal
        visible={editOpen}
        profile={profile}
        onClose={() => setEditOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* Change Avatar Modal Sheet */}
      <ChangeAvatarModal
        visible={avatarOpen}
        profile={profile}
        onClose={() => setAvatarOpen(false)}
        onSuccess={handleSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});