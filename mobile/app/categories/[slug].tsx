import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { Layers } from "lucide-react-native";

import { createClient } from "@/lib/auth/client";
import FeaturedProducts from "@/components/home/FeaturedProducts";

const BRAND_COLOR = "#004d26";
const BRAND_DARK = "#111827";

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!slug) return;

    async function load() {
      setLoading(true);

      const supabase = createClient();

      const { data: rawCategory, error: categoryError } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (categoryError) throw categoryError;

      if (!rawCategory) {
        setCategory(null);
        setProducts([]);
        setLoading(false);
        return;
      }

      const category = {
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
        .eq("category_id", category.id)
        .order("created_at", {
          ascending: false,
        });

      if (productsError) throw productsError;

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

      setCategory(category);
      setProducts(formattedProducts ?? []);
      setLoading(false);
    }

    load().catch((error) => {
      console.error(error);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={BRAND_COLOR} />
      </SafeAreaView>
    );
  }

  if (!category) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.notFound}>Category not found.</Text>
      </SafeAreaView>
    );
  }

  const totalItemsCount = products.reduce(
    (total, product) =>
      total +
      product.colors.reduce(
        (sum: number, color: any) => sum + color.variants.length,
        0
      ),
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Clean Hero Header Card with Sharp Borders */}
        <View style={styles.headerCard}>
          {/* Background Image Watermark */}
          {category.imageUrl && (
            <Image
              source={{ uri: category.imageUrl }}
              style={styles.watermarkImage}
              contentFit="contain"
            />
          )}

          <View style={styles.headerTopRow}>
            {/* Category Avatar Box - Sharp Borders */}
            <View style={styles.imageBox}>
              {category.imageUrl ? (
                <Image
                  source={{ uri: category.imageUrl }}
                  style={styles.image}
                  contentFit="contain"
                  transition={200}
                />
              ) : (
                <View style={styles.letterAvatar}>
                  <Text style={styles.letterText}>
                    {category.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            {/* Item Count Badge - Sharp Borders */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {totalItemsCount} {totalItemsCount === 1 ? "Item" : "Items"}
              </Text>
            </View>
          </View>

          {/* Category Details */}
          <View style={styles.info}>
            <Text style={styles.title}>{category.name}</Text>

            <Text numberOfLines={3} style={styles.description}>
              {category.description ??
                `Explore our handpicked collection of premium products in ${category.name.toLowerCase()}.`}
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
            <Layers size={36} color="#9ca3af" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyText}>
              No products available in this category yet.
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
    backgroundColor: "#f4f4f4",
    paddingTop: 50,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  notFound: {
    fontSize: 15,
    fontWeight: "400",
    color: BRAND_DARK,
  },
  headerCard: {
    backgroundColor: "#ffffff",
    borderRadius: 0, // Sharp corners
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    position: "relative",
    overflow: "hidden",
  },
  watermarkImage: {
    position: "absolute",
    right: -20,
    bottom: -20,
    width: 170,
    height: 170,
    opacity: 0.12,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
    zIndex: 1,
  },
  imageBox: {
    width: 64,
    height: 64,
    borderRadius: 0, // Sharp corners
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  letterAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 0,
    backgroundColor: "rgba(0, 77, 38, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  letterText: {
    fontSize: 22,
    fontWeight: "500", // Non-bold
    color: BRAND_COLOR,
  },
  badge: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 0, // Sharp corners
  },
  badgeText: {
    fontWeight: "400", // Non-bold regular
    color: "#374151",
    fontSize: 12,
  },
  info: {
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "500", // Non-bold clean header weight
    color: BRAND_DARK,
    letterSpacing: 0.2,
  },
  description: {
    marginTop: 6,
    color: "#6b7280",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "400",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  gridHeaderTitle: {
    fontSize: 12,
    fontWeight: "500", // Non-bold text
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginRight: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  emptyContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 0, // Sharp corners
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 8,
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 13,
    fontWeight: "400",
  },
});