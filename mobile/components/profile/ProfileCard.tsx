import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { Camera, Pencil, User, CheckCircle2, Mail } from "lucide-react-native";

import type { Profile } from "@africasuk/types";

interface Props {
  profile: Profile;
  onEdit: () => void;
  onChangeAvatar: () => void;
}

export default function ProfileCard({
  profile,
  onEdit,
  onChangeAvatar,
}: Props) {
  const formattedRole = profile.role
    ? profile.role.replace(/_/g, " ")
    : "CUSTOMER";

  return (
    <View style={styles.card}>
      <View style={styles.identityRow}>
        {/* Avatar with Camera Trigger */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarFrame}>
            {profile.avatarUrl ? (
              <Image
                source={{ uri: profile.avatarUrl }}
                style={styles.avatarImage}
                contentFit="cover"
                transition={150}
                cachePolicy="memory-disk"
              />
            ) : (
              <User size={28} color="#71717a" strokeWidth={1.8} />
            )}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.cameraBadge,
              pressed && styles.cameraBadgePressed,
            ]}
            onPress={onChangeAvatar}
            hitSlop={6}
          >
            <Camera size={12} color="#ffffff" strokeWidth={2} />
          </Pressable>
        </View>

        {/* User Identity Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.userName} numberOfLines={1}>
              {profile.fullName || "AfricaSuk Member"}
            </Text>
            <CheckCircle2 size={15} color="#18181b" strokeWidth={2} />
          </View>

          {Boolean(profile.email) && (
            <View style={styles.emailRow}>
              <Mail size={12} color="#71717a" strokeWidth={1.8} />
              <Text style={styles.emailText} numberOfLines={1}>
                {profile.email}
              </Text>
            </View>
          )}

          <View style={styles.badgeContainer}>
            <View style={styles.roleBadge}>
              <View style={styles.roleDot} />
              <Text style={styles.roleText}>{formattedRole}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Edit Profile CTA */}
      <Pressable
        style={({ pressed }) => [
          styles.editButton,
          pressed && styles.editButtonPressed,
        ]}
        onPress={onEdit}
      >
        <Pencil size={13} color="#18181b" strokeWidth={1.8} />
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    padding: 16,
    gap: 16,
  },

  identityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatarFrame: {
    width: 68,
    height: 68,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    backgroundColor: "#f4f4f5",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  cameraBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: "#18181b",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },

  cameraBadgePressed: {
    opacity: 0.85,
  },

  detailsContainer: {
    flex: 1,
    gap: 3,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.3,
    flexShrink: 1,
  },

  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  emailText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#71717a",
  },

  badgeContainer: {
    flexDirection: "row",
    marginTop: 3,
  },

  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },

  roleDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#18181b",
  },

  roleText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#3f3f46",
    letterSpacing: 0.4,
  },

  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    height: 38,
    borderRadius: 10,
  },

  editButtonPressed: {
    backgroundColor: "#e4e4e7",
  },

  editButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#18181b",
    letterSpacing: -0.1,
  },
});