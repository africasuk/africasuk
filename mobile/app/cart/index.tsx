import React from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";


import CartHeader from "@/components/cart/CartHeader";
import CartList from "@/components/cart/CartList";
import CartSummary from "@/components/cart/CartSummary";
import HomeHeader from "@/components/home/HomeHeader";

export default function CartScreen() {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "bottom"]}
    >
      {/* Same header used on Home and Products */}
      <HomeHeader scrollY={scrollY} />

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View style={styles.container}>
          {/* Cart Section Header */}
          <CartHeader />

          {/* Cart Main Content Stack */}
          <View style={styles.contentStack}>
            {/* List of Cart Items */}
            <CartList />

            {/* Price & Checkout Summary Card */}
            <CartSummary />
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: 80,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },

  container: {
    flex: 1,
  },

  contentStack: {
    marginTop: 24,
    gap: 24,
  },
});