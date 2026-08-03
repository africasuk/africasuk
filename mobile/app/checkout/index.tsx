import React, { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { Redirect, Href } from "expo-router";
import type { Address, Profile } from "@africasuk/types";


import { createClient } from "@/lib/auth/client";

import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutItems from "@/components/checkout/CheckoutItems";
import CheckoutAddresses from "@/components/checkout/CheckoutAddresses";
import CheckoutPaymentWrapper from "@/components/checkout/CheckoutPaymentWrapper";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import { CheckoutProvider } from "@/components/checkout/CheckoutContext";

export default function CheckoutScreen() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const loadCheckoutData = useCallback(async () => {
    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);

const [
  { data: fetchedAddresses, error: addressError },
  { data: fetchedProfile, error: profileError },
] = await Promise.all([
  supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id),

  supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single(),
]);

if (addressError) throw addressError;
if (profileError) throw profileError;

setAddresses(
  (fetchedAddresses ?? []).map((address: any) => ({
    id: address.id,
    userId: address.user_id,

    label: address.label,

    recipientName: address.recipient_name,
    phone: address.phone,

    country: address.country,
    state: address.state,
    city: address.city,
    area: address.area,

    street: address.street,
    building: address.building,
    apartment: address.apartment,
    landmark: address.landmark,

    postalCode: address.postal_code,

    latitude: address.latitude,
    longitude: address.longitude,

    isDefault: address.is_default,

    createdAt: address.created_at,
    updatedAt: address.updated_at,
  }))
);
const profileData = fetchedProfile as any;

console.log("PROFILE:", profileData);

setProfile(
  profileData
    ? ({
        ...profileData,
        fullName: profileData.fullName ?? profileData.full_name,
        avatarUrl: profileData.avatarUrl ?? profileData.avatar_url,
        isActive: profileData.isActive ?? profileData.is_active,
        createdAt: profileData.createdAt ?? profileData.created_at,
        updatedAt: profileData.updatedAt ?? profileData.updated_at,
      } as unknown as Profile)
    : null
);
    } catch (error) {
      console.error("Failed to load checkout data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCheckoutData();
  }, [loadCheckoutData]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" color="#004d26" />
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href={"/auth/login?redirect=/checkout" as Href} />;
  }

  return (
    <CheckoutProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <CheckoutHeader />

          <View style={styles.section}>
            <CheckoutItems />
          </View>

          <View style={styles.section}>
            <CheckoutAddresses
                initialAddresses={addresses}
                onRefresh={loadCheckoutData}
              />
          </View>

          <View style={styles.section}>
            <CheckoutPaymentWrapper />
          </View>

          <View style={styles.section}>
            <CheckoutSummary profile={profile} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </CheckoutProvider>
  );
}

type Styles = {
  container: ViewStyle;
  loading: ViewStyle;
  content: ViewStyle;
  section: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    paddingTop: 60,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 20,
  },
});