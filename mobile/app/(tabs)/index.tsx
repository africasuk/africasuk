
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { createClient } from "@/lib/auth/client";
import { ProductRepository } from "@/repositories/ProductRepository";
import { ProductQueryService } from "@/services/ProductQueryService";

import type { ProductWithDetails } from "@africasuk/types";

import LoadingScreen from "@/components/shared/LoadingScreen";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FeaturedPerfumes from "@/components/home/FeaturedPerfumes";
import ContinueShopping from "@/components/home/ContinueShopping";
import RequestProductSection from "@/components/home/RequestProductSection";
import HomeHeader from "@/components/home/HomeHeader";
import FeaturedWomenBags from "@/components/home/FeaturedWomenBags";
import SSPCurrencyHero from "@/components/home/SSPCurrencyHero";
import GiftDeliveryHero from "@/components/home/GiftDeliveryHero";
import FeaturedElectronics from "@/components/home/FeaturedElectronics";
import FeaturedWatches from "@/components/home/FeaturedWatches";
import FeaturedBeauty from "@/components/home/FeaturedBeauty";

export default function HomeScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Controls the small Christmas location banner.
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const scrollY = useSharedValue(0);

  // Existing scroll handler.
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Detect scrolling without triggering React renders on every frame.
  useAnimatedReaction(
    () => scrollY.value > 35,
    (current, previous) => {
      if (current !== previous) {
        runOnJS(setIsScrolled)(current);
      }
    }
  );

  const productService = useMemo(() => {
    const supabase = createClient();

    return new ProductQueryService(
      new ProductRepository(supabase)
    );
  }, []);

  // Always start the home screen at the top.
  useEffect(() => {
    scrollY.value = 0;
    setIsScrolled(false);

    const frame = requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo({
        y: 0,
        animated: false,
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [scrollY]);

  // Load homepage data.
  useEffect(() => {
    let mounted = true;

    async function loadHome() {
      setLoading(true);
      setError(false);

      try {
        const supabase = createClient();

        const [categoriesResult, productsResult] =
          await Promise.all([
            supabase
              .from("categories")
              .select("*")
              .eq("is_active", true)
              .order("sort_order", {
                ascending: true,
              }),

            productService.getAll({
              random: true,
            }),
          ]);

        if (categoriesResult.error) {
          throw categoriesResult.error;
        }

        if (!mounted) return;

        const formattedCategories =
          (categoriesResult.data ?? []).map(
            (category: any) => ({
              ...category,
              imageUrl: category.image_url,
              isActive: category.is_active,
              createdAt: category.created_at,
              updatedAt: category.updated_at,
              description:
                category.description ??
                `Explore our handpicked collections in ${
                  category.name?.toLowerCase() ?? ""
                }.`,
            })
          );

        setCategories(formattedCategories);
        setProducts(productsResult ?? []);
      } catch (err) {
        console.error("Home loading error:", err);

        if (mounted) {
          setError(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadHome();

    return () => {
      mounted = false;
    };
  }, [productService]);

  if (loading || error) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView
      edges={[]}
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
      }}
    >
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="light-content"
      />

      {/* Existing header design; banner is controlled by scroll state. */}
      <HomeHeader
        scrollY={scrollY}
        isScrolled={isScrolled}
      />

      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        bounces
        contentOffset={{
          x: 0,
          y: 0,
        }}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      >
        <Hero categories={categories} />

        <Categories categories={categories} />

        {/* Random Featured Products */}
        <FeaturedProducts products={products} />

        {/* Random Perfume Collection */}
        <FeaturedPerfumes products={products} />

        <GiftDeliveryHero />

        <FeaturedWomenBags products={products} />

        <RequestProductSection />

        <FeaturedElectronics products={products} />

        <SSPCurrencyHero />

        <FeaturedWatches products={products} />

        <FeaturedBeauty products={products} />

        <ContinueShopping />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
