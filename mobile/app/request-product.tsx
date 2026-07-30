import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { UploadCloud, X, Camera, CheckCircle2, ListOrdered } from "lucide-react-native";
import { useRouter } from "expo-router";

import { submitProductRequestMobile } from "@/services/productRequest";

const BRAND_GREEN = "#004d26";

export default function RequestProductScreen() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Pick image from phone library
  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "You need to allow access to your photos to upload product images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  // Submit request form
  const handleSubmit = async () => {
    if (!phone.trim()) {
      Alert.alert("Required Field", "Please enter your phone number.");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Required Field", "Please enter a product description.");
      return;
    }
    if (!image) {
      Alert.alert("Required Field", "Please attach a photo of the product.");
      return;
    }

    setIsSubmitting(true);

    const result = await submitProductRequestMobile({
      phone,
      description,
      imageUri: image.uri,
      imageMimeType: image.mimeType || "image/jpeg",
      fileName: image.fileName || "request.jpg",
    });

    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
    } else {
      Alert.alert("Submission Error", result.error || "Failed to submit request.");
    }
  };

  const handleReset = () => {
    setPhone("");
    setDescription("");
    setImage(null);
    setIsSuccess(false);
  };
const navigateToRequests = () => {
  router.push("/requests" as const);
};
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Bar Navigation to View Requests */}
         <View style={styles.topNavigation}>
            <TouchableOpacity
              style={styles.viewRequestsHeaderBtn}
              onPress={() => router.push("/requests")}
              activeOpacity={0.8}
            >
              <ListOrdered size={16} color={BRAND_GREEN} />
              <Text style={styles.viewRequestsHeaderBtnText}>
                My Requests
              </Text>
            </TouchableOpacity>
          </View>

          {/* Header Banner */}
          <View style={styles.headerBox}>
            <Text style={styles.title}>REQUEST A PRODUCT</Text>
            <Text style={styles.subtitle}>
              Can&apos;t find the product you&apos;re looking for? Upload a photo and
              tell us what you need—our team will try to source it.
            </Text>
          </View>

          {isSuccess ? (
            /* Success State */
            <View style={styles.successCard}>
              <CheckCircle2 size={56} color={BRAND_GREEN} />
              <Text style={styles.successTitle}>Request Submitted!</Text>
              <Text style={styles.successText}>
                We&apos;ve received your request. Our team will review it and
                contact you shortly at {phone}.
              </Text>

              {/* View My Requests Button */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={navigateToRequests}
              >
                <ListOrdered size={18} color="#ffffff" style={{ marginRight: 8 }} />
                <Text style={styles.primaryButtonText}>View Requested Products</Text>
              </TouchableOpacity>

              {/* Home & Reset Options */}
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() => router.replace("/")}
              >
                <Text style={styles.outlineButtonText}>Return to Home</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} onPress={handleReset}>
                <Text style={styles.secondaryButtonText}>Submit Another Request</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Request Form */
            <View style={styles.formCard}>
              {/* Image Picker Area */}
              <Text style={styles.inputLabel}>Product Photo *</Text>
              {image ? (
                <View style={styles.imagePreviewContainer}>
                  <Image
                    source={{ uri: image.uri }}
                    style={styles.imagePreview}
                    contentFit="cover"
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => setImage(null)}
                  >
                    <X size={18} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.dropzone}
                  onPress={handlePickImage}
                  activeOpacity={0.7}
                >
                  <View style={styles.dropzoneIconCircle}>
                    <Camera size={24} color={BRAND_GREEN} />
                  </View>
                  <Text style={styles.dropzoneText}>
                    Tap to upload or take a photo
                  </Text>
                  <Text style={styles.dropzoneSubtext}>
                    JPG, PNG or WEBP (Max 5MB)
                  </Text>
                </TouchableOpacity>
              )}

              {/* Phone Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+254 700 000 000"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              {/* Description Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Product Description *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe the item, brand, preferred size, or quantity..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <>
                    <UploadCloud size={18} color="#ffffff" style={{ marginRight: 8 }} />
                    <Text style={styles.primaryButtonText}>Submit Request</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingTop: 70,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  topNavigation: {
    alignItems: "flex-end",
    marginBottom: 12,
  },
  viewRequestsHeaderBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f0eb",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  viewRequestsHeaderBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: BRAND_GREEN,
  },
  headerBox: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "#4b5563",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  inputGroup: {
    marginTop: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
  },
  textArea: {
    minHeight: 100,
  },
  dropzone: {
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
    borderRadius: 14,
    backgroundColor: "#f9fafb",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  dropzoneIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e6f0eb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  dropzoneText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  dropzoneSubtext: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 2,
  },
  imagePreviewContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    borderRadius: 14,
    overflow: "hidden",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  removeImageButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: BRAND_GREEN,
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 16,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 25,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  outlineButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  successCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginTop: 12,
  },
  successText: {
    fontSize: 13,
    color: "#4b5563",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 8,
    lineHeight: 18,
  },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: BRAND_GREEN,
    fontWeight: "700",
    fontSize: 13,
  },
});