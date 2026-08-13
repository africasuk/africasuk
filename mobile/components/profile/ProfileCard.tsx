import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Camera, Pencil, User, ShieldCheck, Mail } from "lucide-react-native";

import type { Profile } from "@africasuk/types";

const BRAND = "#005c2e";
const BRAND_DARK = "#002b15";

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
      <View style={styles.contentColumn}>
        {/* Top Header Row: Avatar & Identity Details */}
        <View style={styles.identityRow}>
          {/* Avatar Container with Camera Trigger Badge - Sharp Corners */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarFrame}>
              {profile.avatarUrl ? (
                <Image
                  source={{ uri: profile.avatarUrl }}
                  style={styles.avatarImage}
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <User size={32} color="#9ca3af" />
              )}
            </View>

            {/* Camera Button Badge - Sharp Corners */}
            <TouchableOpacity
              style={styles.cameraBadge}
              activeOpacity={0.85}
              onPress={onChangeAvatar}
            >
              <Camera size={13} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* User Meta Information */}
          <View style={styles.detailsContainer}>
            {/* Full Name & Verification Icon */}
            <View style={styles.nameRow}>
              <Text style={styles.userName} numberOfLines={1}>
                {profile.fullName || "AfricaSuk User"}
              </Text>
              <ShieldCheck size={16} color={BRAND} />
            </View>

            {/* Email */}
            <View style={styles.emailRow}>
              <Mail size={12} color="#9ca3af" />
              <Text style={styles.emailText} numberOfLines={1}>
                {profile.email}
              </Text>
            </View>

            {/* Role Badge - Sharp Corners */}
            <View style={styles.badgeContainer}>
              <View style={styles.roleBadge}>
                <View style={styles.roleDot} />
                <Text style={styles.roleText}>{formattedRole}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Button: Edit Profile - Sharp Corners */}
        <TouchableOpacity
          style={styles.editButton}
          activeOpacity={0.85}
          onPress={onEdit}
        >
          <Pencil size={13} color={BRAND_DARK} />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 0, // Sharp corners design language
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 18,
  },
  contentColumn: {
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
    width: 72,
    height: 72,
    borderRadius: 0, // Sharp corners
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
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
    width: 28,
    height: 28,
    borderRadius: 0, // Sharp corners
    backgroundColor: BRAND_DARK,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffffff",
  },
  detailsContainer: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500", // Non-bold clean header weight
    color: BRAND_DARK,
    letterSpacing: 0.2,
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
    color: "#6b7280",
  },
  badgeContainer: {
    flexDirection: "row",
    marginTop: 4,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 0, // Sharp corners
  },
  roleDot: {
    width: 5,
    height: 5,
    borderRadius: 0, // Sharp square indicator
    backgroundColor: BRAND,
  },
  roleText: {
    fontSize: 9,
    fontWeight: "500", // Clean regular weight
    color: BRAND,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 0, // Sharp corners
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: "500", // Clean regular weight
    color: BRAND_DARK,
    letterSpacing: 0.2,
  },
});