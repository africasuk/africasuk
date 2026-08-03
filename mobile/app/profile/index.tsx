import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Href } from "expo-router";


import type { Profile, Address } from "@africasuk/types";

import { createClient } from "@/lib/auth/client";
import ProfileSection from "@/components/profile/ProfileSection";
import SavedAddresses from "@/components/profile/SavedAddresses";
import SecurityCenter from "@/components/profile/SecurityCenter";

const BRAND = "#005c2e";
const BRAND_DARK = "#002b15";

export default function ProfileScreen() {
  const router = useRouter();

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
    .eq("user_id", user.id),
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
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={BRAND} />
      </SafeAreaView>
    );
  }

  if (notFound) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <View style={styles.notFoundCard}>
          <Text style={styles.notFoundTitle}>Profile not found</Text>
          <Text style={styles.notFoundSubtitle}>
            We couldn&apos;t find your profile.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !profile) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>{error ?? "Unable to load profile"}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchProfileData}
          activeOpacity={0.8}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Main User Profile Header & Details */}
          <ProfileSection profile={profile} />

          {/* User Saved Delivery Addresses */}
          <SavedAddresses addresses={addresses} />

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
    backgroundColor: "#f8fafc",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  container: {
    gap: 24,
  },
  notFoundCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.8)",
    padding: 32,
    alignItems: "center",
    maxWidth: 340,
    width: "100%",
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: BRAND_DARK,
    textAlign: "center",
  },
  notFoundSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#dc2626",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: BRAND_DARK,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 9999,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});