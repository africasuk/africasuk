import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Image } from "expo-image";
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
      {/* Upload Zone & Image Preview - Sharp Corners */}
      <View style={styles.dropZone}>
        <View style={styles.avatarContainer}>
          {activeAvatarUri ? (
            <Image
              source={{ uri: activeAvatarUri }}
              style={styles.avatarImage}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={36} color="#9ca3af" />
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
          activeOpacity={0.85}
        >
          <Camera size={14} color={BRAND_DARK} style={styles.buttonIcon} />
          <Text style={styles.chooseButtonText}>Choose Image</Text>
        </TouchableOpacity>
      </View>

      {/* Selected File Details - Sharp Corners */}
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
            <Trash2 size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      )}

      {/* Progress Status View - Sharp Corners */}
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

      {/* Action Controls - Sharp Corners */}
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
          activeOpacity={0.85}
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
    borderRadius: 0, // Sharp corners design language
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#d1d5db",
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 0, // Sharp corners
    borderWidth: 1,
    borderColor: "#e5e7eb",
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
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: 15,
    fontWeight: "500", // Non-bold clean header weight
    color: BRAND_DARK,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "400",
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
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 0, // Sharp corners
    marginTop: 14,
  },
  buttonIcon: {
    marginRight: 6,
  },
  chooseButtonText: {
    fontSize: 12,
    fontWeight: "500", // Clean regular weight
    color: BRAND_DARK,
  },
  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 0, // Sharp corners
    padding: 12,
    backgroundColor: "#ffffff",
  },
  fileInfo: {
    flex: 1,
    marginRight: 10,
  },
  fileName: {
    fontSize: 12,
    fontWeight: "500", // Clean weight
    color: BRAND_DARK,
  },
  fileSize: {
    fontSize: 11,
    fontWeight: "400",
    color: "#6b7280",
    marginTop: 2,
  },
  deleteButton: {
    padding: 4,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    padding: 12,
    borderRadius: 0, // Sharp corners
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 12,
    fontWeight: "500",
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
    marginTop: 4,
  },
  removeButton: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 0, // Sharp corners
    backgroundColor: "#ffffff",
  },
  removeButtonText: {
    fontSize: 12,
    fontWeight: "500", // Clean regular weight
    color: "#4b5563",
  },
  saveButton: {
    backgroundColor: BRAND,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 0, // Sharp corners
    alignItems: "center",
    justifyContent: "center",
  },
  disabledSaveButton: {
    backgroundColor: "#e5e7eb",
    opacity: 0.8,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500", // Clean regular button weight
    letterSpacing: 0.2,
  },
});