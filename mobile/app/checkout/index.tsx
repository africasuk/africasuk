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
import { AddressRepository, ProfileRepository } from "@africasuk/database";

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

const addressRepository = new AddressRepository(supabase);

const [fetchedAddresses, fetchedProfile] = await Promise.all([
  addressRepository.getAll(user.id),
  ProfileRepository.getByUserId(supabase, user.id),
]);
      setAddresses(fetchedAddresses ?? []);
      setProfile(fetchedProfile ?? null);
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
            <CheckoutAddresses initialAddresses={addresses} />
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