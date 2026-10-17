
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

const ACTIVE_COLOR = "#111111";
const INACTIVE_COLOR = "#71717a";
const TAB_HEIGHT = 62;

function TabLabel({
  text,
  focused,
}: {
  text: string;
  focused: boolean;
}) {
  return (
    <Text
      style={[
        styles.label,
        focused && styles.activeLabel,
      ]}
    >
      {text}
    </Text>
  );
}

function TabIcon({
  children,
  focused,
}: {
  children: React.ReactNode;
  focused: boolean;
}) {
  return (
    <View
      style={[
        styles.iconWrapper,
        focused && styles.activeIconWrapper,
      ]}
    >
      {children}
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom, 10);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarHideOnKeyboard: true,

        tabBarStyle: {
          position: "absolute",
          left: 18,
          right: 18,
          bottom: bottomOffset + 2,
          height: TAB_HEIGHT,

          backgroundColor: "rgba(255,255,255,0.96)",
          borderRadius: 32,

          // Fine Africa Suk green outline
         borderWidth: 0.8,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: "rgba(0,0,0,0.16)",

          paddingTop: 7,
          paddingBottom: 5,

          // Soft black shadow
          elevation: Platform.OS === "android" ? 8 : 0,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.16,
          shadowRadius: 10,
        },

        tabBarItemStyle: {
          height: TAB_HEIGHT - 12,
          marginHorizontal: 3,
          borderRadius: 24,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 0,
        },

        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 2,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 0,
        },

        tabBarAllowFontScaling: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: ({ focused }) => (
            <TabLabel text="Home" focused={focused} />
          ),
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused}>
              <House
                color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
                size={23}
                strokeWidth={focused ? 2.6 : 1.8}
              />
            </TabIcon>
          ),
        }}
      />

      <Tabs.Screen
        name="categories"
        options={{
          title: "Categories",
          tabBarLabel: ({ focused }) => (
            <TabLabel text="Categories" focused={focused} />
          ),
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused}>
              <Grid2x2
                color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
                size={23}
                strokeWidth={focused ? 2.6 : 1.8}
              />
            </TabIcon>
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarLabel: ({ focused }) => (
            <TabLabel text="Orders" focused={focused} />
          ),
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused}>
              <Package
                color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
                size={23}
                strokeWidth={focused ? 2.6 : 1.8}
              />
            </TabIcon>
          ),
        }}
      />

      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarLabel: ({ focused }) => (
            <TabLabel text="Menu" focused={focused} />
          ),
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused}>
              <Menu
                color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
                size={23}
                strokeWidth={focused ? 2.6 : 1.8}
              />
            </TabIcon>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    width: 48,
    height: 29,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },

  // Soft, rounded black glass-like highlight
  activeIconWrapper: {
    backgroundColor: "rgba(0,0,0,0.07)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.05)",
  },

  label: {
    color: INACTIVE_COLOR,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: -0.1,
    textAlign: "center",
  },

  activeLabel: {
    color: ACTIVE_COLOR,
    fontWeight: "800",
  },
});
