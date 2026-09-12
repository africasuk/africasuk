import React from "react";
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
  Bell,
  HelpCircle,
  Shield,
  FileText,
  Info,
  Star,
  Share2,
  LogOut,
  ChevronRight,
  Camera,
} from "lucide-react-native";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.africasuk.app";

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
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.menuRow, isLast && styles.menuRowLast]}
    >
      <View
        style={[
          styles.menuIcon,
          danger && styles.menuIconDanger,
        ]}
      >
        <Icon
          size={19}
          color={danger ? "#DC2626" : "#005C2E"}
          strokeWidth={2}
        />
      </View>

      <Text
        style={[
          styles.menuLabel,
          danger && styles.menuLabelDanger,
        ]}
      >
        {label}
      </Text>

      <ChevronRight
        size={18}
        color={danger ? "#FCA5A5" : "#9CA3AF"}
        strokeWidth={2}
      />
    </TouchableOpacity>
  );
}

export default function MenuScreen() {
  const router = useRouter();

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: `Shop with Confidence on Africa Suk.\n\nDownload the Africa Suk app:\n${PLAY_STORE_URL}`,
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

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => {
            router.replace("/");
          },
        },
      ]
    );
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
          <Text style={styles.headerTitle}>Menu</Text>
          <Text style={styles.headerSubtitle}>
            Manage your account and preferences
          </Text>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <View style={styles.sectionCard}>
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

            <MenuRow
              icon={Bell}
              label="Notifications"
              onPress={() => {
                Alert.alert(
                  "Coming Soon",
                  "Notifications will be available soon."
                );
              }}
            />

            <CurrencySwitcher />
          </View>
        </View>

        {/* Support & Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Legal</Text>

          <View style={styles.sectionCard}>
            <MenuRow
              icon={HelpCircle}
              label="Help Center"
              onPress={() =>
                openWebsite("https://africasuk.com/help")
              }
            />

            <MenuRow
              icon={Shield}
              label="Privacy Policy"
              onPress={() =>
                openWebsite("https://africasuk.com/privacy")
              }
            />

            <MenuRow
              icon={FileText}
              label="Terms & Conditions"
              onPress={() =>
                openWebsite("https://africasuk.com/terms")
              }
            />

            <MenuRow
              icon={Info}
              label="About Africa Suk"
              onPress={() =>
                openWebsite("https://africasuk.com/about")
              }
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

        {/* App */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>

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

        {/* Logout */}
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

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.version}>Africa Suk v1.0.4</Text>

          <Text style={styles.footerText}>
            Shop with Confidence
          </Text>

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
    backgroundColor: "#F8FAF9",
  },

  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 26,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.5,
  },

  headerSubtitle: {
    marginTop: 5,
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },

  section: {
    marginBottom: 22,
  },

  sectionTitle: {
    marginBottom: 9,
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  sectionCard: {
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  menuRow: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F1F2",
  },

  menuRowLast: {
    borderBottomWidth: 0,
  },

  menuIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
    borderRadius: 11,
    backgroundColor: "#EAF5EF",
  },

  menuIconDanger: {
    backgroundColor: "#FEF2F2",
  },

  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },

  menuLabelDanger: {
    color: "#DC2626",
  },

  footer: {
    alignItems: "center",
    paddingTop: 12,
  },

  version: {
    fontSize: 13,
    fontWeight: "700",
    color: "#005C2E",
  },

  footerText: {
    marginTop: 5,
    fontSize: 12,
    color: "#6B7280",
  },

  copyright: {
    marginTop: 4,
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "center",
  },
});