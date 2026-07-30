import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import type { ProductWithDetails } from "@africasuk/types";

import { ProductRepository } from "@/repositories/ProductRepository";
import { ProductQueryService } from "@/services/ProductQueryService";
import { supabase } from "@/lib/supabase/client";

import { ProductDetails } from "@/components/products/ProductDetails";

export default function MobileProductDetailsPage() {
  const { slug, color } =
    useLocalSearchParams<{
      slug: string;
      color?: string;
    }>();

  const [product, setProduct] =
    useState<ProductWithDetails | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const service = useMemo(
    () =>
      new ProductQueryService(
        new ProductRepository(supabase)
      ),
    []
  );

  useEffect(() => {
    async function loadProduct() {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const baseSlug =
          slug.includes("-") &&
          color &&
          slug.endsWith(`-${color}`)
            ? slug.slice(
                0,
                -(color.length + 1)
              )
            : slug;

        const data =
          await service.getBySlug(
            baseSlug
          );

        if (!data) {
          throw new Error(
            "Product not found"
          );
        }

        setProduct(data);
      } catch (err: any) {
        console.error(
          "Error fetching product:",
          err
        );

        setError(
          err?.message ??
            "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug, color, service]);

  if (loading) {
    return (
      <View
        style={
          styles.centerContainer
        }
      >
        <ActivityIndicator
          size="large"
          color="#005c2e"
        />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View
        style={
          styles.centerContainer
        }
      >
        <Text
          style={
            styles.notFoundTitle
          }
        >
          Product Not Found
        </Text>

        <Text
          style={
            styles.notFoundSubtitle
          }
        >
          The product you are
          looking for does not
          exist or has been
          removed.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.contentContainer
      }
    >
      <Stack.Screen
        options={{
          title: product.name,
          headerBackTitle:
            "Back",
          headerTintColor:
            "#111827",
        }}
      />

      <ProductDetails
        product={product}
        selectedColorId={color}
      />
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"#ffffff",
    },

    contentContainer: {
      paddingBottom: 40,
      paddingTop: 50,
    },

    centerContainer: {
      flex: 1,
      justifyContent:
        "center",
      alignItems: "center",
      padding: 24,
      backgroundColor:
        "#ffffff",
    },

    notFoundTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: "#111827",
      marginBottom: 8,
    },

    notFoundSubtitle: {
      fontSize: 14,
      color: "#6b7280",
      textAlign: "center",
    },
  });