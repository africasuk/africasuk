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
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  User,
  Heart,
  ShoppingBag,
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
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.africasuk.app";


export default function MenuScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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

  const bottomInset = insets.bottom > 0 ? insets.bottom : 16;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomInset + 32 },
        ]}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Menu & Settings</Text>
          <Text style={styles.subtitle}>
            Manage your account preferences, orders, and support
          </Text>
        </View>

        {/* My Account */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionTitle}>My Account</Text>
          <View style={styles.sectionCard}>
            <MenuRow
              icon={User}
              label="Account Details"
              onPress={() => router.push("/profile" as Href)}
            />
            <MenuRow
              icon={Package}
              label="Orders"
              onPress={() => router.push("/(tabs)/orders" as Href)}
            />
            <MenuRow
              icon={Heart}
              label="Wishlist"
              onPress={() => router.push("/wishlist" as Href)}
            />
            <MenuRow
              icon={ShoppingBag}
              label="Cart"
              onPress={() => router.push("/cart" as Href)}
            />
            <MenuRow
              icon={FilePlus2}
              label="Requested Products"
              onPress={() => router.push("/requests" as Href)}
              isLast
            />
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.sectionCard}>
            <View style={styles.row}>
              <View style={styles.left}>
                <View style={styles.iconTile}>
                  <Info size={16} color="#71717a" strokeWidth={1.8} />
                </View>
                <Text style={styles.rowText}>Language</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>English</Text>
              </View>
            </View>

            <View style={styles.row}>
              <CurrencySwitcher />
            </View>

            <MenuRow
              icon={Bell}
              label="Notifications"
              onPress={() => {}}
              isLast
            />
          </View>
        </View>

        {/* Support */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionTitle}>Support & Legal</Text>
          <View style={styles.sectionCard}>
            <MenuRow
              icon={Store}
              label="Become a Seller"
              onPress={() => Linking.openURL("https://www.africasuk.com/sell")}
            />
            <MenuRow
              icon={CircleHelp}
              label="Help Center"
              onPress={() => Linking.openURL("https://www.africasuk.com/help")}
            />
            <MenuRow
              icon={Shield}
              label="Privacy Policy"
              onPress={() => Linking.openURL("https://www.africasuk.com/privacy")}
            />
            <MenuRow
              icon={FileText}
              label="Terms & Conditions"
              onPress={() => Linking.openURL("https://www.africasuk.com/terms")}
            />
            <MenuRow
              icon={Info}
              label="About AfricaSuk"
              onPress={() => Linking.openURL("https://www.africasuk.com/about")}
            />
            <MenuRow icon={Share2} label="Share App" onPress={handleShareApp} />
            <MenuRow
              icon={Star}
              label="Rate App"
              onPress={handleRateApp}
              isLast
            />
          </View>
        </View>

        {/* Auth Action */}
        <Pressable
          style={({ pressed }) => [
            styles.authButton,
            isLoggedIn ? styles.logoutButton : styles.loginButton,
            pressed && styles.buttonPressed,
          ]}
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
              <LogOut size={16} color="#dc2626" strokeWidth={2} />
              <Text style={styles.logoutText}>Log Out</Text>
            </>
          ) : (
            <>
              <LogIn size={16} color="#ffffff" strokeWidth={2} />
              <Text style={styles.loginText}>Sign In / Register</Text>
            </>
          )}
        </Pressable>

        <Text style={styles.version}>AfricaSuk v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuRow({
  icon: Icon,
  label,
  onPress,
  isLast = false,
}: {
  icon: React.ComponentType<any>;
  label: string;
  onPress?: () => void;
  isLast?: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        isLast && styles.noBorder,
        pressed && styles.rowPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.left}>
        <View style={styles.iconTile}>
          <Icon size={16} color="#18181b" strokeWidth={1.8} />
        </View>
        <Text style={styles.rowText}>{label}</Text>
      </View>
      <ChevronRight size={15} color="#a1a1aa" strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 16,
  },

  header: {
    gap: 2,
    marginBottom: 4,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#18181b",
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 13,
    color: "#71717a",
    letterSpacing: -0.1,
  },

  sectionGroup: {
    gap: 6,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    paddingHorizontal: 2,
  },

  sectionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
  },

  rowPressed: {
    backgroundColor: "#fafafa",
  },

  noBorder: {
    borderBottomWidth: 0,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconTile: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    justifyContent: "center",
    alignItems: "center",
  },

  rowText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#18181b",
    letterSpacing: -0.1,
  },

  badge: {
    backgroundColor: "#f4f4f5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#71717a",
  },

  authButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 44,
    borderRadius: 10,
    marginTop: 8,
  },

  loginButton: {
    backgroundColor: "#18181b",
  },

  logoutButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#fca5a5",
  },

  loginText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: -0.1,
  },

  logoutText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#dc2626",
    letterSpacing: -0.1,
  },

  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  version: {
    textAlign: "center",
    color: "#a1a1aa",
    fontSize: 11,
    fontWeight: "500",
    marginTop: 4,
  },
});