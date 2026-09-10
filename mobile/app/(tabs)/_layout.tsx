import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  House,
  Grid2x2,
  Package,
  Menu,
} from "lucide-react-native";

const BRAND = "#004d26";
const INACTIVE_COLOR = "#71717a";

// Fixed content height for the touchable bar area (excluding system insets)
const TAB_CONTENT_HEIGHT = 52;
const BASE_PADDING_BOTTOM = 6;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  // If system provides an inset (iOS home indicator or Android gesture navigation),
  // use it directly. If inset is 0 (Android 3-button navigation), fallback to standard padding.
  const bottomInset = insets.bottom > 0 ? insets.bottom : BASE_PADDING_BOTTOM;
  const totalBarHeight = TAB_CONTENT_HEIGHT + bottomInset;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: BRAND,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarHideOnKeyboard: true, // Prevents Android navigation bar from shifting over keyboard

        tabBarStyle: {
          height: totalBarHeight,
          paddingTop: 6,
          paddingBottom: bottomInset,
          borderTopWidth: 1,
          borderTopColor: "#f4f4f5",
          backgroundColor: "#ffffff",
          elevation: 0, // Eliminates Android gray drop shadow
          shadowOpacity: 0, // Eliminates iOS card shadow
        },

        tabBarItemStyle: {
          height: TAB_CONTENT_HEIGHT - 6,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 2,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          letterSpacing: -0.1,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <House
              color={color}
              size={20}
              strokeWidth={focused ? 2.2 : 1.75}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="categories"
        options={{
          title: "Categories",
          tabBarIcon: ({ color, focused }) => (
            <Grid2x2
              color={color}
              size={20}
              strokeWidth={focused ? 2.2 : 1.75}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, focused }) => (
            <Package
              color={color}
              size={20}
              strokeWidth={focused ? 2.2 : 1.75}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color, focused }) => (
            <Menu
              color={color}
              size={20}
              strokeWidth={focused ? 2.2 : 1.75}
            />
          ),
        }}
      />
    </Tabs>
  );
}