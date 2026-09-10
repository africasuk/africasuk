import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, Href } from "expo-router";
import { ArrowLeft, AlertCircle, RefreshCw } from "lucide-react-native";

import type { Profile, Address } from "@africasuk/types";

import { createClient } from "@/lib/auth/client";
import ProfileSection from "@/components/profile/ProfileSection";
import SavedAddresses from "@/components/profile/SavedAddresses";
import SecurityCenter from "@/components/profile/SecurityCenter";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setNotFound(false);

      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth/login" as Href);
        return;
      }

      const [
        { data: fetchedProfile, error: profileError },
        { data: fetchedAddresses, error: addressError },
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single(),

        supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("is_default", { ascending: false }),
      ]);

      if (profileError || !fetchedProfile) {
        setNotFound(true);
        return;
      }

      if (addressError) throw addressError;

      const profileData = fetchedProfile as any;

      setProfile({
        ...profileData,
        avatarUrl: profileData.avatar_url,
      } as Profile);
      setAddresses((fetchedAddresses as Address[]) ?? []);
    } catch (err) {
      console.error("Failed to load profile details:", err);
      setError("Unable to load profile information.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="small" color="#18181b" />
      </View>
    );
  }

  if (notFound) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={["top", "bottom"]}>
        <View style={styles.stateCard}>
          <View style={styles.iconCircleNeutral}>
            <AlertCircle size={22} color="#71717a" strokeWidth={1.8} />
          </View>
          <Text style={styles.stateTitle}>Profile not found</Text>
          <Text style={styles.stateSubtitle}>
            We could not locate an active account profile linked to this user.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.replace("/auth/login" as Href)}
          >
            <Text style={styles.primaryButtonText}>Sign In Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !profile) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={["top", "bottom"]}>
        <View style={styles.stateCard}>
          <View style={styles.iconCircleError}>
            <AlertCircle size={22} color="#dc2626" strokeWidth={1.8} />
          </View>
          <Text style={styles.stateTitle}>Sync Failed</Text>
          <Text style={styles.stateSubtitle}>
            {error ?? "Unable to connect to your account profile."}
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={fetchProfileData}
          >
            <RefreshCw size={14} color="#ffffff" strokeWidth={2} />
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const bottomInset = insets.bottom > 0 ? insets.bottom : 16;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* Top Header Navigation */}
      <View style={styles.topBar}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <ArrowLeft size={18} color="#18181b" strokeWidth={2} />
        </Pressable>

        <Text style={styles.topBarTitle} numberOfLines={1}>
          Account Details
        </Text>

        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomInset + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Main User Profile Header & Details */}
          <ProfileSection profile={profile} onRefresh={fetchProfileData} />

          {/* User Saved Delivery Addresses */}
          <SavedAddresses addresses={addresses} onRefresh={fetchProfileData} />

          {/* Security & Active Sessions */}
          <SecurityCenter devices={[]} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
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

  backButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonPressed: {
    backgroundColor: "#e4e4e7",
  },

  topBarTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2,
  },

  topBarSpacer: {
    width: 34,
  },

  scrollContent: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  container: {
    gap: 16,
  },

  stateCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: "center",
    maxWidth: 320,
    width: "100%",
    gap: 6,
  },

  iconCircleNeutral: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },

  iconCircleError: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },

  stateTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.3,
  },

  stateSubtitle: {
    fontSize: 12,
    color: "#71717a",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 10,
  },

  primaryButton: {
    height: 42,
    paddingHorizontal: 18,
    backgroundColor: "#18181b",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  primaryButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: -0.1,
  },

  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
});