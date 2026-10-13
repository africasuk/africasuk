
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import LoadingScreen from "@/components/shared/LoadingScreen";
import { createClient } from "@/lib/auth/client";

export default function LoadingRoute() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const loadApp = async () => {
      try {
        const supabase = createClient();

        const [
          categoriesResult,
          productsResult,
          brandsResult,
        ] = await Promise.all([
          supabase
            .from("categories")
            .select("*")
            .eq("is_active", true)
            .order("sort_order", { ascending: true }),

          supabase
            .from("products")
            .select(`
              *,
              category:categories(*),
              brand:brands(*),
              colors:product_colors(
                *,
                images:product_images(*),
                variants:product_variants(*)
              )
            `)
            .eq("is_active", true),

          supabase
            .from("brands")
            .select("*")
            .eq("is_active", true),
        ]);

        if (categoriesResult.error) {
          throw categoriesResult.error;
        }

        if (productsResult.error) {
          throw productsResult.error;
        }

        if (brandsResult.error) {
          throw brandsResult.error;
        }

        const categories = categoriesResult.data ?? [];

        if (categories.length === 0) {
          throw new Error("Home categories are empty");
        }

        if (mounted) {
          setReady(true);
        }
      } catch (error) {
        console.error("App startup error:", error);

        // Keep the loading screen visible and retry.
        if (mounted) {
          retryTimer = setTimeout(() => {
            void loadApp();
          }, 1500);
        }
      }
    };

    void loadApp();

    return () => {
      mounted = false;

      if (retryTimer) {
        clearTimeout(retryTimer);
      }
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 300);

    return () => clearTimeout(timer);
  }, [ready, router]);

  return <LoadingScreen />;
}
