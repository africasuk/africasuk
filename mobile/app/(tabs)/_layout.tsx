import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Grid2x2,
  House,
  Menu,
  Package,
} from "lucide-react-native";
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

const BRAND = "#005c2e";
const INACTIVE_COLOR = "#71717a";
const BORDER = "#f0f0f0";

const TAB_HEIGHT = 58;

function TextLabel({ text }: { text: string }) {
  return (
    <View style={styles.labelWrapper}>
      <Text style={styles.label}>{text}</Text>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  const bottomInset = Math.max(insets.bottom, 0);
  const totalBarHeight = TAB_HEIGHT + bottomInset;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: BRAND,
        tabBarInactiveTintColor: INACTIVE_COLOR,

        tabBarHideOnKeyboard: true,

        tabBarStyle: {
          height: totalBarHeight,
          paddingTop: 5,
          paddingBottom: bottomInset,

          backgroundColor: "#ffffff",

          borderTopWidth: 1,
          borderTopColor: BORDER,

          elevation: 0,
          shadowOpacity: 0,
          shadowColor: "transparent",

          ...(Platform.OS === "android" && {
            elevation: 0,
          }),
        },

        tabBarItemStyle: {
          height: TAB_HEIGHT - 5,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 3,
        },

        tabBarAllowFontScaling: false,
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",

          tabBarLabel: ({ focused }) =>
            focused ? (
              <View style={styles.activeLine} />
            ) : (
              <TextLabel text="Home" />
            ),

          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrapper}>
              <House
                color={color}
                size={23}
                strokeWidth={focused ? 2.5 : 1.8}
              />
            </View>
          ),
        }}
      />

      {/* CATEGORIES */}
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categories",

          tabBarLabel: ({ focused }) =>
            focused ? (
              <View style={styles.activeLine} />
            ) : (
              <TextLabel text="Categories" />
            ),

          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrapper}>
              <Grid2x2
                color={color}
                size={23}
                strokeWidth={focused ? 2.5 : 1.8}
              />
            </View>
          ),
        }}
      />

      {/* ORDERS */}
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",

          tabBarLabel: ({ focused }) =>
            focused ? (
              <View style={styles.activeLine} />
            ) : (
              <TextLabel text="Orders" />
            ),

          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrapper}>
              <Package
                color={color}
                size={23}
                strokeWidth={focused ? 2.5 : 1.8}
              />
            </View>
          ),
        }}
      />

      {/* MENU */}
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",

          tabBarLabel: ({ focused }) =>
            focused ? (
              <View style={styles.activeLine} />
            ) : (
              <TextLabel text="Menu" />
            ),

          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrapper}>
              <Menu
                color={color}
                size={23}
                strokeWidth={focused ? 2.5 : 1.8}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    width: 42,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  labelWrapper: {
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    color: INACTIVE_COLOR,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: -0.1,
  },

  activeLine: {
    width: 28,
    height: 3,
    marginTop: 3,
    borderRadius: 3,
    backgroundColor: BRAND,
  },
});