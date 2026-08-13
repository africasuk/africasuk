import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  Share,
} from "react-native";
import * as Linking from "expo-linking";
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

import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { createClient } from "@/lib/auth/client";

const supabase = createClient();

const BRAND_LIGHT = "#008744";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.africasuk.app";

// Type definition for optional action callbacks
type MenuItem = [
  string,
  React.ComponentType<any>,
  ((() => void) | undefined)?
];

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

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: `Shop with confidence on AfricaSuk 🛍️\n\nDownload the app:\n${PLAY_STORE_URL}`,
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const handleRateApp = () => {
    Linking.openURL(PLAY_STORE_URL).catch((err) =>
      console.error("Failed to open store link:", err)
    );
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
          <Text style={styles.comingSoon}>Language — Coming Soon</Text>
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
          [
            "Become a Seller",
            Store,
            () => Linking.openURL("https://www.africasuk.com/sell"),
          ],
          [
            "Help Center",
            CircleHelp,
            () => Linking.openURL("https://www.africasuk.com/help"),
          ],
          [
            "Privacy Policy",
            Shield,
            () => Linking.openURL("https://www.africasuk.com/privacy"),
          ],
          [
            "Terms & Conditions",
            FileText,
            () => Linking.openURL("https://www.africasuk.com/terms"),
          ],
          [
            "About AfricaSuk",
            Info,
            () => Linking.openURL("https://www.africasuk.com/about"),
          ],
          ["Share App", Share2, handleShareApp],
          ["Rate App", Star, handleRateApp],
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
  items: MenuItem[];
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {items.map(([label, Icon, onPress]) => (
        <Pressable key={label} style={styles.row} onPress={onPress}>
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
    paddingTop: 30,
  },

  content: {
    padding: 16,
    paddingTop: 45,
    paddingBottom: 40,
  },

  section: {
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderRadius: 0, // Sharp corners
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },

  sectionTitle: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    fontSize: 11,
    fontWeight: "500", // Non-bold clean header weight
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
    fontSize: 14,
    fontWeight: "500", // Non-bold clean text weight
    color: "#111827",
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: 0, // Sharp corners
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  logoutText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "500", // Non-bold text weight
    color: "#dc2626",
  },

  version: {
    textAlign: "center",
    marginTop: 20,
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "400",
  },

  comingSoon: {
    color: "#888",
    fontSize: 14,
    fontWeight: "400",
  },
});