import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
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
          {/* Avatar Container with Camera Trigger Badge */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarFrame}>
              {profile.avatarUrl ? (
                <Image
                  source={{ uri: profile.avatarUrl }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <User size={36} color="#9ca3af" />
              )}
            </View>

            {/* Camera Button Badge */}
            <TouchableOpacity
              style={styles.cameraBadge}
              activeOpacity={0.8}
              onPress={onChangeAvatar}
            >
              <Camera size={14} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* User Meta Information */}
          <View style={styles.detailsContainer}>
            {/* Full Name & Verification Icon */}
            <View style={styles.nameRow}>
              <Text style={styles.userName} numberOfLines={1}>
                {profile.fullName || "AfricaSuk User"}
              </Text>
              <ShieldCheck size={18} color={BRAND} />
            </View>

            {/* Email */}
            <View style={styles.emailRow}>
              <Mail size={13} color="#9ca3af" />
              <Text style={styles.emailText} numberOfLines={1}>
                {profile.email}
              </Text>
            </View>

            {/* Role Badge */}
            <View style={styles.badgeContainer}>
              <View style={styles.roleBadge}>
                <View style={styles.roleDot} />
                <Text style={styles.roleText}>{formattedRole}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Button: Edit Profile */}
        <TouchableOpacity
          style={styles.editButton}
          activeOpacity={0.8}
          onPress={onEdit}
        >
          <Pencil size={14} color={BRAND} />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.8)",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  contentColumn: {
    gap: 20,
  },
  identityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarFrame: {
    width: 80,
    height: 80,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#d1fae5",
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
    bottom: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: BRAND_DARK,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
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
    fontSize: 18,
    fontWeight: "900",
    color: BRAND_DARK,
    textTransform: "uppercase",
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
    fontWeight: "500",
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
    borderColor: "#d1fae5",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  roleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BRAND,
  },
  roleText: {
    fontSize: 10,
    fontWeight: "900",
    color: BRAND,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.8)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: "900",
    color: BRAND_DARK,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
});