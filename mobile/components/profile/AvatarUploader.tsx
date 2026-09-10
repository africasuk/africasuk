import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Camera, Trash2, User, Upload } from "lucide-react-native";

import { useAvatarUpload, type MobileSelectedFile } from "./hooks/useAvatarUpload";

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
            <Image
              source={{ uri: activeAvatarUri }}
              style={styles.avatarImage}
              contentFit="cover"
              transition={150}
              cachePolicy="memory-disk"
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={36} color="#71717a" strokeWidth={1.75} />
            </View>
          )}
        </View>

        <Text style={styles.title}>Profile Picture</Text>
        <Text style={styles.subtitle}>
          Select a high-resolution square image from your device.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.chooseButton,
            pressed && styles.chooseButtonPressed,
          ]}
          onPress={pickImage}
          disabled={uploading}
        >
          <Camera size={14} color="#18181b" strokeWidth={1.8} />
          <Text style={styles.chooseButtonText}>Choose Photo</Text>
        </Pressable>
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

          <Pressable
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && styles.deleteButtonPressed,
            ]}
            onPress={clear}
            disabled={uploading}
            hitSlop={8}
          >
            <Trash2 size={15} color="#dc2626" strokeWidth={1.8} />
          </Pressable>
        </View>
      )}

      {/* Progress Status Bar */}
      {uploading && (
        <View style={styles.statusCard}>
          <ActivityIndicator size="small" color="#18181b" />
          <View style={styles.statusTextContainer}>
            <Text style={styles.statusTitle}>
              {status === "preparing" && "Compressing image..."}
              {status === "uploading" && "Uploading to storage..."}
              {status === "saving" && "Updating profile records..."}
              {status === "success" && "Upload complete"}
            </Text>
            <Text style={styles.statusSubtitle}>
              Please do not navigate away or close the app.
            </Text>
          </View>
        </View>
      )}

      {/* Action Controls */}
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.removeButton,
            pressed && styles.removeButtonPressed,
          ]}
          onPress={clear}
          disabled={uploading}
        >
          <Text style={styles.removeButtonText}>Reset</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            (!file || uploading) && styles.disabledSaveButton,
            pressed && file && !uploading && styles.saveButtonPressed,
          ]}
          disabled={!file || uploading}
          onPress={() => {
            void handleUpload();
          }}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Upload size={14} color="#ffffff" strokeWidth={2} />
              <Text style={styles.saveButtonText}>Upload Picture</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },

  dropZone: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#d4d4d8",
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fafafa",
  },

  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: "#ffffff",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  avatarPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f5",
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2,
  },

  subtitle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#71717a",
    marginTop: 2,
    textAlign: "center",
    maxWidth: 240,
    lineHeight: 16,
  },

  chooseButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    backgroundColor: "#ffffff",
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 14,
  },

  chooseButtonPressed: {
    backgroundColor: "#f4f4f5",
  },

  chooseButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#18181b",
    letterSpacing: -0.1,
  },

  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#ffffff",
  },

  fileInfo: {
    flex: 1,
    marginRight: 10,
    gap: 2,
  },

  fileName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#18181b",
  },

  fileSize: {
    fontSize: 11,
    color: "#71717a",
  },

  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fef2f2",
  },

  deleteButtonPressed: {
    backgroundColor: "#fee2e2",
  },

  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    padding: 12,
    borderRadius: 10,
  },

  statusTextContainer: {
    flex: 1,
    gap: 2,
  },

  statusTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#18181b",
  },

  statusSubtitle: {
    fontSize: 11,
    color: "#71717a",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },

  removeButton: {
    borderWidth: 1,
    borderColor: "#e4e4e7",
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },

  removeButtonPressed: {
    backgroundColor: "#f4f4f5",
  },

  removeButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#71717a",
  },

  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#18181b",
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  saveButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  disabledSaveButton: {
    opacity: 0.45,
  },

  saveButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: -0.1,
  },
});