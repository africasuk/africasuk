import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Layers } from "lucide-react-native";

import type { ProductWithDetails } from "@africasuk/types";

import { ProductCard } from "@/components/products/ProductCard";
import { supabase } from "@/lib/supabase/client";
import { ProductRepository } from "@/repositories/ProductRepository";
import { ProductQueryService } from "@/services/ProductQueryService";
import LoadingScreen from "@/components/shared/LoadingScreen";


const BRAND_COLOR = "#005c2e";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
};

type ColorProduct = ProductWithDetails & {
  selectedColorId?: string;
};


export default function CategoryPage() {
  const router = useRouter();

  const { slug } = useLocalSearchParams<{
    slug: string;
  }>();

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const service = useMemo(
    () =>
      new ProductQueryService(
        new ProductRepository(supabase),
      ),
    [],
  );


  /*
   * Load category + all products.
   */
  const fetchCategory = useCallback(
    async (showLoading = true) => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        if (showLoading) {
          setLoading(true);
        }

        /*
         * Category
         */
        const { data: categoryData, error: categoryError } =
          await supabase
            .from("categories")
            .select("*")
            .eq("slug", slug)
            .maybeSingle();

        if (categoryError) {
          throw categoryError;
        }

        if (!categoryData) {
          setCategory(null);
          setProducts([]);
          return;
        }

        setCategory({
          id: categoryData.id,
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description,
          imageUrl: categoryData.image_url,
        });


        /*
         * ALL products.
         *
         * We use the same ProductQueryService as the
         * working Products page so images, colors,
         * variants, prices and ratings stay intact.
         */
        const allProducts = await service.getAll();


        /*
         * Only products belonging to this category.
         *
         * No slice.
         * No limit.
         */
        const categoryProductList =
          (allProducts ?? []).filter(
            (product) =>
              product.categoryId === categoryData.id,
          );

        setProducts(categoryProductList);
      } catch (error) {
        console.error(
          "Error loading category:",
          error,
        );

        setCategory(null);
        setProducts([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [service, slug],
  );


  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);


  const onRefresh = () => {
    setRefreshing(true);
    fetchCategory(false);
  };


  /*
   * Convert every product color into its own card.
   *
   * Example:
   *
   * Product A
   *  - Black
   *  - White
   *  - Red
   *
   * becomes:
   *
   * A - Black
   * A - White
   * A - Red
   *
   * Then everything is randomized.
   */
  const colorProducts = useMemo<ColorProduct[]>(() => {
    const result: ColorProduct[] = [];

    for (const product of products ?? []) {
      const colors = product.colors ?? [];

      for (const color of colors) {
        /*
         * Only show colors that have available variants.
         */
        if (
          !color.variants ||
          color.variants.length === 0
        ) {
          continue;
        }

        result.push({
          ...product,

          /*
           * Unique ID for product + color.
           */
          id: `${product.id}-${color.id}`,

          /*
           * Show color name on the card.
           */
          name: `${product.name} - ${color.name}`,

          /*
           * Tell ProductCard which color to display.
           */
          selectedColorId: color.id,

          /*
           * Keep ONLY this color so ProductCard
           * uses its correct image and variants.
           */
          colors: [color],
        });
      }
    }

    /*
     * Randomize all product/color cards.
     */
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [result[i], result[j]] = [
        result[j],
        result[i],
      ];
    }

    return result;
  }, [products]);


  /*
   * Loading
   */
if (loading && !refreshing) {
  return <LoadingScreen />;
}


  /*
   * Category not found
   */
  if (!category) {
    return (
      <SafeAreaView
        style={styles.center}
        edges={["top", "bottom"]}
      >
        <Text style={styles.notFound}>
          Category not found.
        </Text>
      </SafeAreaView>
    );
  }


  /*
   * SCREEN
   */
  return (
    <SafeAreaView
      style={styles.container}
      edges={[ "left", "right"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={BRAND_COLOR}
            colors={[BRAND_COLOR]}
          />
        }
        contentContainerStyle={styles.content}
      >

        {/* -------------------------------- */}
        {/* HERO */}
        {/* -------------------------------- */}

        <View style={styles.hero}>

          {category.imageUrl ? (
            <Image
              source={{
                uri: category.imageUrl,
              }}
              style={styles.heroImage}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
          ) : (
            <View
              style={styles.fallbackContainer}
            >
              <Layers
                size={48}
                color="#71717a"
                strokeWidth={1.5}
              />
            </View>
          )}


          {/* Dark fade */}
          <LinearGradient
            colors={[
              "rgba(0,0,0,0)",
              "rgba(0,0,0,0.12)",
              "rgba(0,0,0,0.48)",
              "rgba(0,0,0,0.80)",
            ]}
            locations={[
              0,
              0.4,
              0.72,
              1,
            ]}
            style={styles.heroOverlay}
            pointerEvents="none"
          />


          {/* Back */}
          <Pressable
            style={({ pressed }) => [
              styles.heroBackButton,
              pressed &&
                styles.heroBackButtonPressed,
            ]}
            onPress={() => router.back()}
            hitSlop={10}
          >
            <ArrowLeft
              size={20}
              color="#ffffff"
              strokeWidth={2.2}
            />
          </Pressable>


          {/* Category title */}
          <View style={styles.heroContent}>

            <View style={styles.categoryBadge}>
              <Text
                style={styles.categoryBadgeText}
              >
                COLLECTION
              </Text>
            </View>

            <Text
              style={styles.heroTitle}
              numberOfLines={2}
            >
              {category.name}
            </Text>

          </View>
        </View>


        {/* -------------------------------- */}
        {/* DESCRIPTION */}
        {/* -------------------------------- */}

        <View
          style={styles.descriptionSection}
        >
          <Text
            style={styles.descriptionText}
            numberOfLines={1}
          >
            {category.description ??
              `Explore our handpicked curation of verified pieces in ${String(
                category.name,
              ).toLowerCase()}.`}
          </Text>

          <Pressable
            hitSlop={8}
            onPress={() => {
              // Read more action can be added here.
            }}
          >
            <Text style={styles.readMore}>
              Read more
            </Text>
          </Pressable>
        </View>


        {/* -------------------------------- */}
        {/* PRODUCTS HEADER */}
        {/* -------------------------------- */}

        <View style={styles.sectionHeaderRow}>
          <Text
            style={styles.gridHeaderTitle}
          >
            Products
          </Text>

          <Text style={styles.itemCount}>
            {colorProducts.length}{" "}
            {colorProducts.length === 1
              ? "item"
              : "items"}
          </Text>

          <View style={styles.dividerLine} />
        </View>


        {/* -------------------------------- */}
        {/* ALL CATEGORY PRODUCTS */}
        {/* -------------------------------- */}

        {colorProducts.length > 0 ? (
          <View style={styles.productsGrid}>

            {colorProducts.map((product) => (
              <View
                key={product.id}
                style={styles.productCardWrapper}
              >
                <ProductCard
                  product={product}
                />
              </View>
            ))}

          </View>
        ) : (
          <View
            style={styles.emptyContainer}
          >
            <View
              style={styles.emptyIconCircle}
            >
              <Layers
                size={22}
                color="#71717a"
                strokeWidth={1.75}
              />
            </View>

            <Text
              style={styles.emptyTitle}
            >
              No products available
            </Text>

            <Text
              style={styles.emptySubtitle}
            >
              We are currently sourcing new
              pieces for this category.
            </Text>
          </View>
        )}


        {/* -------------------------------- */}
        {/* REQUEST PRODUCT */}
        {/* -------------------------------- */}

        {colorProducts.length > 0 && (
          <View
            style={styles.footerContainer}
          >
            <Pressable
              style={({ pressed }) => [
                styles.requestButton,
                pressed &&
                  styles.requestButtonPressed,
              ]}
              onPress={() =>
                router.push(
                  "/request-product" as never,
                )
              }
            >
              <Text
                style={styles.requestButtonText}
              >
                Can&apos;t Find a Product?
                {" "}Request It
              </Text>
            </Pressable>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}


/* ========================================= */
/* STYLES */
/* ========================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },

  notFound: {
    fontSize: 14,
    fontWeight: "500",
    color: "#71717a",
  },

  content: {
    paddingBottom: 32,
  },


  /* -------------------------------------- */
  /* HERO */
  /* -------------------------------------- */

hero: {
  position: "relative",
  width: "100%",
  height: 360,
  backgroundColor: "#18181b",
  overflow: "hidden",
},

  heroImage: {
    width: "100%",
    height: "100%",
  },

  fallbackContainer: {
    flex: 1,
    backgroundColor: "#f4f4f5",
    justifyContent: "center",
    alignItems: "center",
  },

  heroOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 230,
  },

  heroBackButton: {
    position: "absolute",
    top: 40,
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor:
      "rgba(0,0,0,0.45)",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  heroBackButtonPressed: {
    opacity: 0.7,
  },

  heroContent: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 24,
  },

  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor:
      "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.28)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },

  categoryBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.7,
  },

  heroTitle: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.6,
    textShadowColor:
      "rgba(0,0,0,0.7)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 4,
  },


  /* -------------------------------------- */
  /* DESCRIPTION */
  /* -------------------------------------- */

  descriptionSection: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  descriptionText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "400",
    color: "#71717a",
  },

  readMore: {
    fontSize: 13,
    fontWeight: "700",
    color: BRAND_COLOR,
  },


  /* -------------------------------------- */
  /* PRODUCTS HEADER */
  /* -------------------------------------- */

  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 14,
  },

  gridHeaderTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#18181b",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  itemCount: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9ca3af",
    textTransform: "uppercase",
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#f4f4f5",
  },


  /* -------------------------------------- */
  /* PRODUCTS */
  /* -------------------------------------- */

  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
    paddingHorizontal: 16,
  },

  productCardWrapper: {
    width: "48.5%",
  },


  /* -------------------------------------- */
  /* REQUEST */
  /* -------------------------------------- */

  footerContainer: {
    marginTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 20,
    width: "100%",
  },

  requestButton: {
    width: "100%",
    minHeight: 48,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: BRAND_COLOR,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,

    shadowColor: BRAND_COLOR,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },

  requestButtonPressed: {
    opacity: 0.8,
  },

  requestButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: BRAND_COLOR,
    letterSpacing: -0.2,
  },


  /* -------------------------------------- */
  /* EMPTY */
  /* -------------------------------------- */

  emptyContainer: {
    marginHorizontal: 16,
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
  },

  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
  },

  emptySubtitle: {
    fontSize: 13,
    color: "#9ca3af",
    marginTop: 4,
    textAlign: "center",
  },
});