import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { Stack } from "expo-router";

import WishlistHeader from "@/components/wishlist/WishlistHeader";
import WishlistList from "@/components/wishlist/WishlistList";

const BRAND_DARK = "#002b15";
const BRAND_GREEN = "#005c2e";

export default function WishlistScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // Force re-fetch trigger down to children
    setRefreshKey((prev) => prev + 1);
    
    // Simulate brief pull-to-refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: "My Wishlist",
          headerTitleStyle: { fontWeight: "800", color: BRAND_DARK },
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[BRAND_GREEN]}
            tintColor={BRAND_GREEN}
          />
        }
      >
        <View style={styles.container}>
          <WishlistHeader />

          <View style={styles.listContainer}>
            <WishlistList key={refreshKey} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  listContainer: {
    marginTop: 16,
  },
});