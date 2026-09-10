import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import {
  UploadCloud,
  X,
  Camera,
  CheckCircle2,
  ListOrdered,
  ArrowRight,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { submitProductRequestMobile } from "@/services/productRequest";

export default function RequestProductScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const bottomInset = insets.bottom > 0 ? insets.bottom : 16;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Top Header Navigation */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Product Sourcing</Text>

        <Pressable
          style={({ pressed }) => [
            styles.viewRequestsHeaderBtn,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push("/requests")}
          hitSlop={6}
        >
          <ListOrdered size={14} color="#18181b" strokeWidth={1.8} />
          <Text style={styles.viewRequestsHeaderBtnText}>My Requests</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: bottomInset + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentWrapper}>
            {/* Header Description Card */}
            <View style={styles.headerBox}>
              <Text style={styles.title}>Request a Product</Text>
              <Text style={styles.subtitle}>
                Can&apos;t find what you&apos;re looking for? Share an image and product
                specifications, and our procurement team will source it for you.
              </Text>
            </View>

            {isSuccess ? (
              /* Success State */
              <View style={styles.successCard}>
                <View style={styles.successIconCircle}>
                  <CheckCircle2 size={32} color="#15803d" strokeWidth={1.8} />
                </View>
                <Text style={styles.successTitle}>Request Submitted</Text>
                <Text style={styles.successText}>
                  We have received your item request. Our team will review
                  availability and reach out to you directly at {phone}.
                </Text>

                <View style={styles.successActions}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.primaryButton,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={() => router.push("/requests")}
                  >
                    <ListOrdered size={14} color="#ffffff" strokeWidth={2} />
                    <Text style={styles.primaryButtonText}>View My Requests</Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.outlineButton,
                      pressed && styles.outlineButtonPressed,
                    ]}
                    onPress={() => router.replace("/")}
                  >
                    <Text style={styles.outlineButtonText}>Return to Home</Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.secondaryButton,
                      pressed && styles.secondaryButtonPressed,
                    ]}
                    onPress={handleReset}
                  >
                    <Text style={styles.secondaryButtonText}>
                      Submit Another Request
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              /* Request Form Card */
              <View style={styles.formCard}>
                {/* Image Picker */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.inputLabel}>Product Photo *</Text>
                  {image ? (
                    <View style={styles.imagePreviewContainer}>
                      <Image
                        source={{ uri: image.uri }}
                        style={styles.imagePreview}
                        contentFit="cover"
                        transition={150}
                      />
                      <Pressable
                        style={({ pressed }) => [
                          styles.removeImageButton,
                          pressed && styles.buttonPressed,
                        ]}
                        onPress={() => setImage(null)}
                        hitSlop={6}
                      >
                        <X size={14} color="#ffffff" strokeWidth={2} />
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable
                      style={({ pressed }) => [
                        styles.dropzone,
                        pressed && styles.dropzonePressed,
                      ]}
                      onPress={handlePickImage}
                    >
                      <View style={styles.dropzoneIconCircle}>
                        <Camera size={18} color="#18181b" strokeWidth={1.8} />
                      </View>
                      <Text style={styles.dropzoneText}>
                        Upload or take a photo
                      </Text>
                      <Text style={styles.dropzoneSubtext}>
                        PNG, JPG, or WEBP (up to 5MB)
                      </Text>
                    </Pressable>
                  )}
                </View>

                {/* Phone Input */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.inputLabel}>Contact Phone *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="+211 912 345 678"
                    placeholderTextColor="#a1a1aa"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    editable={!isSubmitting}
                  />
                </View>

                {/* Description Input */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.inputLabel}>Product Details *</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Describe item name, brand, preferred quantity, size, or specific features..."
                    placeholderTextColor="#a1a1aa"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    value={description}
                    onChangeText={setDescription}
                    editable={!isSubmitting}
                  />
                </View>

                {/* Submit Button */}
                <Pressable
                  style={({ pressed }) => [
                    styles.primaryButton,
                    isSubmitting && styles.buttonDisabled,
                    pressed && !isSubmitting && styles.buttonPressed,
                  ]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <>
                      <UploadCloud size={15} color="#ffffff" strokeWidth={2} />
                      <Text style={styles.primaryButtonText}>Submit Request</Text>
                      <ArrowRight size={14} color="#ffffff" strokeWidth={2} />
                    </>
                  )}
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  topBar: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
    backgroundColor: "#ffffff",
  },

  topBarTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2,
  },

  viewRequestsHeaderBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 8,
    gap: 6,
  },

  viewRequestsHeaderBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#18181b",
    letterSpacing: -0.1,
  },

  keyboardAvoid: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  contentWrapper: {
    maxWidth: 560,
    width: "100%",
    alignSelf: "center",
    gap: 16,
  },

  headerBox: {
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.4,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#71717a",
    textAlign: "center",
    lineHeight: 18,
    maxWidth: 340,
  },

  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    gap: 14,
  },

  fieldGroup: {
    gap: 6,
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#27272a",
    letterSpacing: -0.1,
  },

  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 10,
    paddingHorizontal: 13,
    height: 44,
    fontSize: 13,
    color: "#18181b",
  },

  textArea: {
    height: 104,
    paddingTop: 12,
    paddingBottom: 12,
  },

  dropzone: {
    borderWidth: 1.5,
    borderColor: "#d4d4d8",
    borderStyle: "dashed",
    borderRadius: 12,
    backgroundColor: "#fafafa",
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  dropzonePressed: {
    backgroundColor: "#f4f4f5",
  },

  dropzoneIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },

  dropzoneText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#18181b",
    letterSpacing: -0.1,
  },

  dropzoneSubtext: {
    fontSize: 11,
    color: "#71717a",
  },

  imagePreviewContainer: {
    position: "relative",
    width: "100%",
    height: 190,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    overflow: "hidden",
    backgroundColor: "#f4f4f5",
  },

  imagePreview: {
    width: "100%",
    height: "100%",
  },

  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(24, 24, 27, 0.85)",
    width: 28,
    height: 28,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButton: {
    backgroundColor: "#18181b",
    height: 44,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },

  primaryButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: -0.1,
  },

  outlineButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  outlineButtonPressed: {
    backgroundColor: "#f4f4f5",
  },

  outlineButtonText: {
    color: "#18181b",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: -0.1,
  },

  secondaryButton: {
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonPressed: {
    opacity: 0.7,
  },

  secondaryButtonText: {
    color: "#71717a",
    fontWeight: "600",
    fontSize: 12,
  },

  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  buttonDisabled: {
    opacity: 0.45,
  },

  successCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
    gap: 8,
  },

  successIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },

  successTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.3,
  },

  successText: {
    fontSize: 13,
    color: "#71717a",
    textAlign: "center",
    lineHeight: 18,
    maxWidth: 300,
    marginBottom: 10,
  },

  successActions: {
    width: "100%",
    gap: 8,
  },
});