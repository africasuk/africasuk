import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Layers } from "lucide-react-native";

import { createClient } from "@/lib/auth/client";
import FeaturedProducts from "@/components/home/FeaturedProducts";

export default function CategoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;

    async function load() {
      setLoading(true);

      const supabase = createClient();

      const { data: rawCategory, error: categoryError } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (categoryError) {
        console.error("Failed to load category:", categoryError);
      }

      if (!rawCategory) {
        if (isMounted) {
          setCategory(null);
          setProducts([]);
          setLoading(false);
        }
        return;
      }

      const formattedCategory = {
        ...(rawCategory as any),
        imageUrl: (rawCategory as any).image_url,
        isActive: (rawCategory as any).is_active,
        createdAt: (rawCategory as any).created_at,
        updatedAt: (rawCategory as any).updated_at,
      };

      const { data: rawProducts, error: productsError } = await supabase
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
        .eq("category_id", formattedCategory.id)
        .order("created_at", { ascending: false });

      if (productsError) {
        console.error("Failed to load category products:", productsError);
      }

      const formattedProducts = (rawProducts ?? []).map((product: any) => ({
        ...product,
        allowCod: product.allow_cod,
        allowOnlinePayment: product.allow_online_payment,
        categoryId: product.category_id,
        brandId: product.brand_id,
        isActive: product.is_active,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
        category: product.category
          ? {
              ...product.category,
              imageUrl: product.category.image_url,
              isActive: product.category.is_active,
              createdAt: product.category.created_at,
              updatedAt: product.category.updated_at,
            }
          : null,
        brand: product.brand
          ? {
              ...product.brand,
              logoUrl: product.brand.logo_url,
              isActive: product.brand.is_active,
              createdAt: product.brand.createdAt,
              updatedAt: product.brand.updated_at,
            }
          : null,
        colors: (product.colors ?? []).map((color: any) => ({
          ...color,
          productId: color.product_id,
          hexCode: color.hex_code,
          createdAt: color.created_at,
          updatedAt: color.updated_at,
          images: (color.images ?? []).map((image: any) => ({
            ...image,
            productColorId: image.product_color_id,
            imageUrl: image.image_url,
            sortOrder: image.sort_order,
            createdAt: image.created_at,
          })),
          variants: (color.variants ?? []).map((variant: any) => ({
            ...variant,
            productColorId: variant.product_color_id,
            optionName: variant.option_name,
            optionValue: variant.option_value,
            isActive: variant.is_active,
            price: Number(variant.price),
            stock: variant.stock,
            createdAt: variant.created_at,
            updatedAt: variant.updated_at,
          })),
        })),
      }));

      if (isMounted) {
        setCategory(formattedCategory);
        setProducts(formattedProducts ?? []);
        setLoading(false);
      }
    }

    load().catch((error) => {
      console.error(error);
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color="#18181b" />
      </View>
    );
  }

  if (!category) {
    return (
      <SafeAreaView style={styles.center} edges={["top", "bottom"]}>
        <Text style={styles.notFound}>Category not found.</Text>
      </SafeAreaView>
    );
  }

  const bottomInset = insets.bottom > 0 ? insets.bottom : 16;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Editorial Navigation Top Bar */}
      <View style={styles.topBar}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <ArrowLeft size={18} color="#18181b" strokeWidth={2} />
        </Pressable>

        <Text style={styles.topBarTitle} numberOfLines={1}>
          {category.name}
        </Text>

        <View style={styles.countPill}>
          <Text style={styles.countPillText}>
            {products.length} {products.length === 1 ? "item" : "items"}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomInset + 32 },
        ]}
      >
        {/* Full-bleed Hero Card with Overlay Title & Subtitle Below */}
        <View style={styles.heroCard}>
          <View style={styles.imageWrapper}>
            {category.imageUrl ? (
              <Image
                source={{ uri: category.imageUrl }}
                style={styles.heroImage}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
            ) : (
              <View style={styles.fallbackContainer}>
                <Layers size={48} color="#71717a" strokeWidth={1.5} />
              </View>
            )}

            {/* Scrim Gradient for Readability */}
            <LinearGradient
              colors={["rgba(0,0,0,0.05)", "rgba(0,0,0,0.72)"]}
              style={styles.imageOverlay}
            />

            {/* Badge & Title on Image */}
            <View style={styles.overlayContent}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>COLLECTION</Text>
              </View>
              <Text style={styles.heroTitle} numberOfLines={2}>
                {category.name}
              </Text>
            </View>
          </View>

          {/* Description Below Image */}
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionText}>
              {category.description ??
                `Explore our handpicked curation of verified pieces in ${category.name.toLowerCase()}.`}
            </Text>
          </View>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.gridHeaderTitle}>Products</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Products Grid */}
        {products.length > 0 ? (
          <FeaturedProducts products={products} />
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Layers size={22} color="#71717a" strokeWidth={1.75} />
            </View>
            <Text style={styles.emptyTitle}>No products available</Text>
            <Text style={styles.emptyText}>
              We are currently sourcing new pieces for this category.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

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

  topBar: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
    backgroundColor: "#ffffff",
  },

  backButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonPressed: {
    backgroundColor: "#e4e4e7",
  },

  topBarTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2,
    marginHorizontal: 12,
  },

  countPill: {
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  countPillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#71717a",
  },

  content: {
    padding: 16,
    gap: 16,
  },

  heroCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    overflow: "hidden",
  },

  imageWrapper: {
    position: "relative",
    width: "100%",
    height: 190,
    backgroundColor: "#f4f4f5",
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

  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  overlayContent: {
    position: "absolute",
    bottom: 14,
    left: 14,
    right: 14,
    gap: 6,
  },

  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 5,
  },

  categoryBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
  },

  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.5,
  },

  descriptionSection: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fafafa",
    borderTopWidth: 1,
    borderTopColor: "#f4f4f5",
  },

  descriptionText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "400",
    color: "#71717a",
  },

  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  gridHeaderTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#18181b",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#f4f4f5",
  },

  emptyContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 4,
  },

  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2,
  },

  emptyText: {
    color: "#71717a",
    fontSize: 12,
    textAlign: "center",
  },
});