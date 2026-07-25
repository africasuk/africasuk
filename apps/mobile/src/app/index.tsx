import { ScrollView } from "react-native";

import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FeaturedBrands from "@/components/home/FeaturedBrands";
import ContinueShopping from "@/components/home/ContinueShopping";
import RequestProductSection from "@/components/home/RequestProductSection";

export default function HomeScreen() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <Hero />

      <Categories />

      <FeaturedProducts />

      <FeaturedBrands />

      <RequestProductSection />

      <ContinueShopping />
    </ScrollView>
  );
}