import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter, Href } from "expo-router";
import {
  User,
  Heart,
  ShoppingCart,
  FilePlus2,
  Package,
  Bell,
  Store,
  CircleHelp,
  Shield,
  FileText,
  Info,
  Share2,
  Star,
  LogOut,
  LogIn,
  ChevronRight,
} from "lucide-react-native";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { createClient } from "@/lib/auth/client";

const supabase = createClient();

const BRAND_LIGHT = "#008744";

export default function MenuScreen() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setIsLoggedIn(!!user);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        Alert.alert("Logout Failed", error.message);
        return;
      }

      setIsLoggedIn(false);
      router.replace("/");
      Alert.alert("Success", "You have been signed out.");
    } catch {
      Alert.alert("Error", "Failed to sign out.");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* My Account */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Account</Text>

        <Pressable
          style={styles.row}
          onPress={() => router.push("/profile" as Href)}
        >
          <View style={styles.left}>
            <User size={20} color={BRAND_LIGHT} />
            <Text style={styles.rowText}>Account Detail</Text>
          </View>
          <ChevronRight size={18} color="#9ca3af" />
        </Pressable>

        <Pressable
          style={styles.row}
          onPress={() => router.push("/(tabs)/orders" as Href)}
        >
          <View style={styles.left}>
            <Package size={20} color={BRAND_LIGHT} />
            <Text style={styles.rowText}>Orders</Text>
          </View>
          <ChevronRight size={18} color="#9ca3af" />
        </Pressable>

        <Pressable
          style={styles.row}
          onPress={() => router.push("/wishlist" as Href)}
        >
          <View style={styles.left}>
            <Heart size={20} color={BRAND_LIGHT} />
            <Text style={styles.rowText}>Wishlist</Text>
          </View>
          <ChevronRight size={18} color="#9ca3af" />
        </Pressable>

        <Pressable
          style={styles.row}
          onPress={() => router.push("/cart" as Href)}
        >
          <View style={styles.left}>
            <ShoppingCart size={20} color={BRAND_LIGHT} />
            <Text style={styles.rowText}>Cart</Text>
          </View>
          <ChevronRight size={18} color="#9ca3af" />
        </Pressable>

        {/* Requested Products Link under Cart */}
        <Pressable
          style={styles.row}
          onPress={() => router.push("/requests" as Href)}
        >
          <View style={styles.left}>
            <FilePlus2 size={20} color={BRAND_LIGHT} />
            <Text style={styles.rowText}>Requested Products</Text>
          </View>
          <ChevronRight size={18} color="#9ca3af" />
        </Pressable>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.row}>
          <LanguageSwitcher />
        </View>

        <View style={styles.row}>
          <CurrencySwitcher />
        </View>

        <Pressable style={styles.row}>
          <View style={styles.left}>
            <Bell size={20} color={BRAND_LIGHT} />
            <Text style={styles.rowText}>Notifications</Text>
          </View>
          <ChevronRight size={18} color="#9ca3af" />
        </Pressable>
      </View>

      {/* Support */}
      <MenuSection
        title="Support"
        items={[
          ["Become a Seller", Store],
          ["Help Center", CircleHelp],
          ["Privacy Policy", Shield],
          ["Terms & Conditions", FileText],
          ["About AfricaSuk", Info],
          ["Share App", Share2],
          ["Rate App", Star],
        ]}
      />

      {/* Logout / Login Action */}
      <Pressable
        style={styles.logoutButton}
        onPress={() => {
          if (isLoggedIn) {
            handleLogout();
          } else {
            router.push("/auth/login" as Href);
          }
        }}
      >
        {isLoggedIn ? (
          <>
            <LogOut size={20} color="#dc2626" />
            <Text style={styles.logoutText}>Logout</Text>
          </>
        ) : (
          <>
            <LogIn size={20} color={BRAND_LIGHT} />
            <Text style={[styles.logoutText, { color: BRAND_LIGHT }]}>
              Login
            </Text>
          </>
        )}
      </Pressable>

      <Text style={styles.version}>AfricaSuk v1.0.0</Text>
    </ScrollView>
  );
}

function MenuSection({
  title,
  items,
}: {
  title: string;
  items: [string, any][];
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {items.map(([label, Icon]) => (
        <Pressable key={label} style={styles.row}>
          <View style={styles.left}>
            <Icon size={20} color={BRAND_LIGHT} />
            <Text style={styles.rowText}>{label}</Text>
          </View>

          <ChevronRight size={18} color="#9ca3af" />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingTop: 60,
  },

  content: {
    padding: 16,
    paddingTop: 45,
    paddingBottom: 40,
  },

  section: {
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.8)",
    overflow: "hidden",
  },

  sectionTitle: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    fontSize: 12,
    fontWeight: "800",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowText: {
    marginLeft: 14,
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.8)",
  },

  logoutText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "800",
    color: "#dc2626",
  },

  version: {
    textAlign: "center",
    marginTop: 20,
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "600",
  },
});