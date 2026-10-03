import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User,
  Package,
  Heart,
  HelpCircle,
  Shield,
  FileText,
  Info,
  Star,
  Share2,
  LogOut,
  ChevronRight,
  Camera,
  Globe2,
} from "lucide-react-native";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";

import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { createClient } from "@/lib/auth/client";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.africasuk.app";

const APP_VERSION = "1.0.7";

const openWebsite = async (url: string) => {
  try {
    await WebBrowser.openBrowserAsync(url);
  } catch (error) {
    console.error("Failed to open website:", error);
  }
};

type MenuRowProps = {
  icon: React.ComponentType<any>;
  label: string;
  onPress: () => void;
  danger?: boolean;
  isLast?: boolean;
};

function MenuRow({
  icon: Icon,
  label,
  onPress,
  danger = false,
  isLast = false,
}: MenuRowProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.65}
      onPress={onPress}
      style={[styles.menuRow, isLast && styles.menuRowLast]}
    >
      <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
        <Icon
          size={18}
          color={danger ? "#DC2626" : "#171717"}
          strokeWidth={1.8}
        />
      </View>

      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>
        {label}
      </Text>

      <ChevronRight
        size={16}
        color={danger ? "#F87171" : "#A3A3A3"}
        strokeWidth={1.8}
      />
    </TouchableOpacity>
  );
}

export default function MenuScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    const loadUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (mounted) {
          setUser(user);
          setAuthLoading(false);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        if (mounted) {
          setUser(null);
          setAuthLoading(false);
        }
      }
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = () => {
    router.push("/auth/login");
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            try {
              const supabase = createClient();
              const { error } = await supabase.auth.signOut();

              if (error) {
                Alert.alert(
                  "Unable to Log Out",
                  "Something went wrong. Please try again."
                );
                return;
              }

              setUser(null);
              router.replace("/");
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert(
                "Unable to Log Out",
                "Something went wrong. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          `Shop with Confidence on Africa Suk.\n\n` +
          `Download the Africa Suk app:\n` +
          PLAY_STORE_URL,
      });
    } catch (error) {
      console.error("Failed to share app:", error);
    }
  };

  const handleRateApp = async () => {
    try {
      await Linking.openURL(PLAY_STORE_URL);
    } catch (error) {
      console.error("Failed to open Play Store:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Account & Settings</Text>
          <Text style={styles.headerSubtitle}>
            Manage preferences, orders, and application details
          </Text>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <View style={styles.sectionCard}>
            {authLoading ? (
              <View style={styles.authLoading}>
                <Text style={styles.authLoadingText}>
                  Checking account status...
                </Text>
              </View>
            ) : !user ? (
              <>
                <View style={styles.signInCard}>
                  <View style={styles.signInIcon}>
                    <User size={20} color="#171717" strokeWidth={1.8} />
                  </View>

                  <View style={styles.signInContent}>
                    <Text style={styles.signInTitle}>Sign In</Text>
                    <Text style={styles.signInSubtitle}>
                      Access order histories, your saved items, and settings
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleSignIn}
                    style={styles.signInButton}
                  >
                    <Text style={styles.signInButtonText}>Log In</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <MenuRow
                  icon={User}
                  label="My Profile"
                  onPress={() => router.push("/profile")}
                />
                <MenuRow
                  icon={Package}
                  label="My Orders"
                  onPress={() => router.push("/orders")}
                />
                <MenuRow
                  icon={Heart}
                  label="Wishlist"
                  onPress={() => router.push("/wishlist")}
                />
              </>
            )}

            {/* Currency Row */}
            <View style={styles.currencyDivider} />
            <View style={styles.currencyRow}>
              <View style={styles.currencyIcon}>
                <Globe2 size={18} color="#171717" strokeWidth={1.8} />
              </View>

              <View style={styles.currencyContent}>
                <Text style={styles.currencyTitle}>Currency</Text>
                <Text style={styles.currencyDescription}>
                  Preferred display currency
                </Text>
              </View>

              <CurrencySwitcher />
            </View>
          </View>
        </View>

        {/* Support & Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Legal</Text>

          <View style={styles.sectionCard}>
            <MenuRow
              icon={HelpCircle}
              label="Help Center"
              onPress={() => openWebsite("https://africasuk.com/help")}
            />
            <MenuRow
              icon={Shield}
              label="Privacy Policy"
              onPress={() => openWebsite("https://africasuk.com/privacy")}
            />
            <MenuRow
              icon={FileText}
              label="Terms & Conditions"
              onPress={() => openWebsite("https://africasuk.com/terms")}
            />
            <MenuRow
              icon={Info}
              label="About Africa Suk"
              onPress={() => openWebsite("https://africasuk.com/about")}
            />
            <MenuRow
              icon={Camera}
              label="Request a Product"
              isLast
              onPress={() =>
                openWebsite("https://africasuk.com/request-product")
              }
            />
          </View>
        </View>

        {/* Application */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application</Text>

          <View style={styles.sectionCard}>
            <MenuRow
              icon={Star}
              label="Rate the App"
              onPress={handleRateApp}
            />
            <MenuRow
              icon={Share2}
              label="Share Africa Suk"
              isLast
              onPress={handleShareApp}
            />
          </View>
        </View>

        {/* Sign Out */}
        {!authLoading && user && (
          <View style={styles.section}>
            <View style={styles.sectionCard}>
              <MenuRow
                icon={LogOut}
                label="Log Out"
                danger
                isLast
                onPress={handleLogout}
              />
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.version}>v{APP_VERSION}</Text>
          <Text style={styles.copyright}>
            © {new Date().getFullYear()} Africa Suk. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 48,
  },

  /* Header */
  header: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0A0A0A",
    letterSpacing: -0.6,
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#737373",
    lineHeight: 18,
  },

  /* Section */
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 11,
    fontWeight: "600",
    color: "#737373",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  sectionCard: {
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  /* Menu Row */
  menuRow: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5E5",
  },
  menuRowLast: {
    borderBottomWidth: 0,
  },
  menuIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  menuIconDanger: {
    backgroundColor: "#FEF2F2",
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#171717",
  },
  menuLabelDanger: {
    color: "#DC2626",
    fontWeight: "600",
  },

  /* Sign in banner */
  signInCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5E5",
  },
  signInIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    marginRight: 12,
  },
  signInContent: {
    flex: 1,
    paddingRight: 8,
  },
  signInTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0A0A0A",
  },
  signInSubtitle: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    color: "#737373",
  },
  signInButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "#0A0A0A",
  },
  signInButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  /* Currency */
  currencyDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E5E5",
    marginHorizontal: 16,
  },
  currencyRow: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  currencyIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    marginRight: 12,
  },
  currencyContent: {
    flex: 1,
    paddingRight: 8,
  },
  currencyTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#171717",
  },
  currencyDescription: {
    marginTop: 2,
    fontSize: 11,
    color: "#737373",
  },

  /* Loading State */
  authLoading: {
    minHeight: 56,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  authLoadingText: {
    fontSize: 13,
    color: "#737373",
  },

  /* Footer */
  footer: {
    alignItems: "center",
    paddingTop: 16,
    gap: 4,
  },
  version: {
    fontSize: 12,
    fontWeight: "500",
    color: "#737373",
  },
  copyright: {
    fontSize: 11,
    color: "#A3A3A3",
    textAlign: "center",
  },
});