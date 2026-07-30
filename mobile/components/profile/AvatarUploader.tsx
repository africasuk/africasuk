import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, Trash2, User } from "lucide-react-native";

import { useAvatarUpload, type MobileSelectedFile } from "./hooks/useAvatarUpload";

const BRAND = "#005c2e";
const BRAND_DARK = "#002b15";

interface Props {
  userId: string;
  currentAvatar: string | null;
  onUploaded?: (url: string) => void | Promise<void>;
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
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Permission to access the media library is required to upload an avatar."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        const selectedFile: MobileSelectedFile = {
          uri: asset.uri,
          name: asset.fileName ?? `avatar_${Date.now()}.jpg`,
          type: asset.mimeType ?? "image/jpeg",
          size: asset.fileSize ?? 0,
        };

        selectFile(selectedFile);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Could not select image from gallery.");
    }
  };

  async function handleUpload() {
    const url = await upload();

    if (url) {
      await Promise.resolve(onUploaded?.(url));
    }
  }

  const activeAvatarUri = preview ?? currentAvatar;

  return (
    <View style={styles.container}>
      {/* Upload Zone & Image Preview */}
      <View style={styles.dropZone}>
        <View style={styles.avatarContainer}>
          {activeAvatarUri ? (
            <Image source={{ uri: activeAvatarUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={40} color="#9ca3af" />
            </View>
          )}
        </View>

        <Text style={styles.title}>Profile Picture</Text>
        <Text style={styles.subtitle}>
          Choose an image from your device gallery.
        </Text>

        <TouchableOpacity
          style={styles.chooseButton}
          onPress={pickImage}
          disabled={uploading}
          activeOpacity={0.8}
        >
          <Camera size={16} color={BRAND_DARK} style={styles.buttonIcon} />
          <Text style={styles.chooseButtonText}>Choose Image</Text>
        </TouchableOpacity>
      </View>

      {/* Selected File Details */}
      {file && (
        <View style={styles.fileCard}>
          <View style={styles.fileInfo}>
            <Text style={styles.fileName} numberOfLines={1}>
              {file.name}
            </Text>
            {typeof file.size === "number" && file.size > 0 && (
              <Text style={styles.fileSize}>{formatSize(file.size)}</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={clear}
            disabled={uploading}
            activeOpacity={0.7}
          >
            <Trash2 size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>
      )}

      {/* Progress Status View */}
      {uploading && (
        <View style={styles.statusCard}>
          <ActivityIndicator size="small" color={BRAND} />
          <View style={styles.statusTextContainer}>
            <Text style={styles.statusTitle}>
              {status === "preparing" && "Preparing image..."}
              {status === "uploading" && "Uploading image..."}
              {status === "saving" && "Saving profile..."}
              {status === "success" && "Finished"}
            </Text>
            <Text style={styles.statusSubtitle}>
              Please don&apos;t close this screen.
            </Text>
          </View>
        </View>
      )}

      {/* Action Controls */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={clear}
          disabled={uploading}
          activeOpacity={0.7}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.saveButton,
            (!file || uploading) && styles.disabledSaveButton,
          ]}
          disabled={!file || uploading}
          onPress={() => {
            void handleUpload();
          }}
          activeOpacity={0.8}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Profile Picture</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  dropZone: {
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#e5e7eb",
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#d1fae5",
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: "#ffffff",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  avatarPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: BRAND_DARK,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    marginTop: 2,
    textAlign: "center",
  },
  chooseButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 9999,
    marginTop: 16,
  },
  buttonIcon: {
    marginRight: 6,
  },
  chooseButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: BRAND_DARK,
  },
  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 12,
    backgroundColor: "#ffffff",
  },
  fileInfo: {
    flex: 1,
    marginRight: 10,
  },
  fileName: {
    fontSize: 13,
    fontWeight: "700",
    color: BRAND_DARK,
  },
  fileSize: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 2,
  },
  deleteButton: {
    padding: 6,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#d1fae5",
    padding: 12,
    borderRadius: 14,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: BRAND_DARK,
  },
  statusSubtitle: {
    fontSize: 11,
    color: "#059669",
    marginTop: 1,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  removeButton: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 9999,
  },
  removeButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4b5563",
  },
  saveButton: {
    backgroundColor: BRAND,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledSaveButton: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
  },
});