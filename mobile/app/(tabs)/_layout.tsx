import { Platform } from "react-native";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  House,
  Grid2x2,
  Package,
  Menu,
} from "lucide-react-native";

const BRAND = "#004d26";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  // Dynamic height ensuring system navigation bars (Android/iOS) never overlap tabs
  const tabHeight = Platform.select({
    ios: 56 + insets.bottom,
    android: 58 + insets.bottom,
    default: 64,
  });

  const paddingBottom = Platform.select({
    ios: insets.bottom > 0 ? insets.bottom : 8,
    android: insets.bottom > 0 ? insets.bottom + 4 : 8,
    default: 8,
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: BRAND,
        tabBarInactiveTintColor: "#9CA3AF",

        tabBarStyle: {
          height: tabHeight,
          paddingTop: 8,
          paddingBottom: paddingBottom,
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          backgroundColor: "#FFFFFF",
          elevation: 0,
          shadowOpacity: 0,
        },

        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginTop: 3,
          letterSpacing: 0.2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <House color={color} size={20} />
          ),
        }}
      />

      <Tabs.Screen
        name="categories"
        options={{
          title: "Categories",
          tabBarIcon: ({ color }) => (
            <Grid2x2 color={color} size={20} />
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => (
            <Package color={color} size={20} />
          ),
        }}
      />

      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color }) => (
            <Menu color={color} size={20} />
          ),
        }}
      />
    </Tabs>
  );
}