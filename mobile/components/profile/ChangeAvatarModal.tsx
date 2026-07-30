import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { X } from "lucide-react-native";

import type { Profile } from "@africasuk/types";
import AvatarUploader from "./AvatarUploader";

const BRAND_DARK = "#002b15";

interface Props {
  visible: boolean;
  profile: Profile;
  onClose: () => void;
  onSuccess?: () => void | Promise<void>;
}

export default function ChangeAvatarModal({
  visible,
  profile,
  onClose,
  onSuccess,
}: Props) {
  const handleUploaded = async () => {
    await Promise.resolve(onSuccess?.());
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            {/* Modal Header */}
            <View style={styles.header}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.title}>Change Profile Picture</Text>
                <Text style={styles.subtitle}>
                  Upload a new profile picture. Supported formats are JPG, PNG
                  and WEBP (maximum 5 MB).
                </Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Mobile Native Avatar Uploader */}
            <AvatarUploader
              userId={profile.userId}
              currentAvatar={profile.avatarUrl}
              onUploaded={handleUploaded}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    gap: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: BRAND_DARK,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6b7280",
    marginTop: 4,
    lineHeight: 18,
  },
  closeButton: {
    padding: 4,
  },
});