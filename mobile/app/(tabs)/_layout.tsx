import React, { useEffect, useRef, useState, useMemo } from "react";
import { Tabs, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import {
  Home,
  Grid2X2,
  Search,
  Package,
  UserRound,
} from "lucide-react-native";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DARK_GREEN = "#000000";
const BLACK = "#000000";
const INACTIVE = "#000000";

const BAR_HEIGHT = 64;
const TAB_COUNT = 5;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TAB_WIDTH = SCREEN_WIDTH / TAB_COUNT;

/**
 * Generates an SVG path that draws a continuous, organic hill bump 
 * centered directly over whichever tab index is active.
 */
function createCurvedBarPath(
  width: number,
  height: number,
  activeIndex: number,
  tabWidth: number
) {
  const centerX = activeIndex * tabWidth + tabWidth / 2;
  const bumpW = 34; // half-width of the curve
  const bumpH = 15; // peak height extending above the bar rim

  const x0 = Math.max(0, centerX - bumpW);
  const x1 = Math.min(width, centerX + bumpW);

  return `
    M 0,0
    L ${x0},0
    C ${centerX - 18},0 ${centerX - 18},-${bumpH} ${centerX},-${bumpH}
    C ${centerX + 18},-${bumpH} ${centerX + 18},0 ${x1},0
    L ${width},0
    L ${width},${height}
    L 0,${height}
    Z
  `;
}

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
  isNavigating: boolean;
  onTabPress: () => void;
}

function CurvedGlassTabBar({
  state,
  descriptors,
  navigation,
  isNavigating,
  onTabPress,
}: CustomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === "android" ? 10 : 8);
  const totalHeight = BAR_HEIGHT + bottomInset;

  const activeIndex = state.index;
  const activeColor = isNavigating ? BLACK : DARK_GREEN;

  const pathData = useMemo(() => {
  return createCurvedBarPath(SCREEN_WIDTH, totalHeight, activeIndex, TAB_WIDTH);
}, [totalHeight, activeIndex]);
  return (
    <View
      style={[
        styles.tabBarWrapper,
        {
          height: totalHeight,
          paddingBottom: bottomInset,
        },
      ]}
      pointerEvents="box-none"
    >
      {/* SVG Background with organic crest bump */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg
          width={SCREEN_WIDTH}
          height={totalHeight + 20}
          style={{ top: -20, position: "absolute" }}
        >
          <Path
            d={pathData}
            fill="#ffffff"
            stroke={isNavigating ? "rgba(17, 17, 17, 0.25)" : "rgba(0, 77, 50, 0.2)"}
            strokeWidth={1.5}
            transform="translate(0, 20)"
          />
        </Svg>
      </View>

      {/* Tab Buttons */}
      <View style={styles.tabsRow}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              onTabPress();
              navigation.navigate(route.name);
            }
          };

          const iconColor = isFocused ? "#ffffff" : INACTIVE;

          const renderIcon = () => {
            if (isFocused && isNavigating) {
              return <ActivityIndicator size="small" color="#ffffff" />;
            }

            switch (index) {
              case 0:
                return <Home size={20} color={iconColor} strokeWidth={isFocused ? 2.4 : 1.8} />;
              case 1:
                return <Grid2X2 size={19} color={iconColor} strokeWidth={isFocused ? 2.4 : 1.8} />;
              case 2:
                return <Search size={20} color={iconColor} strokeWidth={isFocused ? 2.4 : 1.8} />;
              case 3:
                return <Package size={19} color={iconColor} strokeWidth={isFocused ? 2.4 : 1.8} />;
              case 4:
                return <UserRound size={20} color={iconColor} strokeWidth={isFocused ? 2.4 : 1.8} />;
              default:
                return null;
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              activeOpacity={0.85}
              style={styles.tabButton}
            >
              <View
                style={[
                  styles.iconWrap,
                  isFocused && [
                    styles.activeBubble,
                    {
                      backgroundColor: activeColor,
                      shadowColor: activeColor,
                    },
                  ],
                ]}
              >
                {renderIcon()}
              </View>

              <Text
                numberOfLines={1}
                ellipsizeMode="clip"
                allowFontScaling={false}
                style={[
                  styles.label,
                  isFocused && [styles.activeLabel, { color: activeColor }],
                ]}
              >
                {options.title ?? route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousPathRef = useRef(pathname);

  useEffect(() => {
    if (previousPathRef.current !== pathname) {
      previousPathRef.current = pathname;
      setIsNavigating(false);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleTabPress = () => {
    setIsNavigating(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
      timeoutRef.current = null;
    }, 1200);
  };

  return (
    <View style={styles.root}>
      <Tabs
        tabBar={(props) => (
          <CurvedGlassTabBar
            {...props}
            isNavigating={isNavigating}
            onTabPress={handleTabPress}
          />
        )}
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="categories" options={{ title: "Category" }} />
        <Tabs.Screen name="search/index" options={{ title: "Search" }} />
        <Tabs.Screen name="orders" options={{ title: "Orders" }} />
        <Tabs.Screen name="menu" options={{ title: "Menu" }} />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f5f6f8",
  },

  tabBarWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },

  tabsRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
  },

  tabButton: {
    flex: 1,
    height: BAR_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 4,
  },

  iconWrap: {
    width: 36,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  activeBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginTop: -22,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.28,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),
  },

  label: {
    fontSize: 9.5,
    fontWeight: "500",
    color: INACTIVE,
    marginTop: 2,
    textAlign: "center",
  },

  activeLabel: {
    fontWeight: "700",
  },
});