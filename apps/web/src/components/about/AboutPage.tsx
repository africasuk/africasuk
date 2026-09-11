import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  CheckCircle2,
  Telescope,
  PackageCheck,
  FileText,
  Smartphone,
  MapPin,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Layers,
  Globe,
} from "lucide-react";

import Container from "@/components/layout/Container";
import AboutHero from "./AboutHero";

export default function AboutPage() {
  const categories = [
    "Electronics & phones",
    "Laptops & accessories",
    "Fashion & footwear",
    "Bags & watches",
    "Beauty & fragrance",
    "Home & kitchen",
    "Food & everyday essentials",
    "Baby products",
    "Office & school supplies",
    "Automotive products",
    "Gifts and more",
  ];

  const approachSteps = [
    "Source",
    "Select",
    "List",
    "Sell",
    "Deliver",
  ];

  return (
    <>
      <div className="py-10 sm:py-16 bg-white text-gray-900">
        <Container>
          <div className="mx-auto max-w-5xl">
            
            {/* Header */}
            <AboutHero />

            <div className="grid gap-12 lg:grid-cols-12 items-start mt-6">
              
              {/* Main Column */}
              <div className="lg:col-span-8 space-y-10 leading-relaxed">
                
                {/* Intro Overview */}
                <section className="space-y-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-[#004d26] block">
                    Making Shopping Easier in South Sudan
                  </span>
                  
                  <p className="text-lg text-gray-900 font-medium leading-relaxed">
                    <strong className="font-extrabold text-black">Africa Suk</strong> is a South Sudanese online shopping brand that makes it easier to find and purchase products in South Sudan.
                  </p>

                  <p className="text-base text-gray-800 leading-relaxed">
                    We source products from regional and international suppliers and make them available directly to customers through our website and mobile app. From everyday essentials to electronics, fashion, beauty, home products, and more, Africa Suk brings a growing range of products together in one convenient place.
                  </p>
                </section>

                <hr className="border-gray-300" />

                {/* Section: What We Do */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2.5 flex items-center gap-3">
                    <ShoppingBag className="h-6 w-6 text-[#004d26] shrink-0" />
                    <span>What We Do</span>
                  </h2>

                  <p className="text-base text-gray-800 leading-relaxed">
                    At Africa Suk, we focus on making online shopping simple. We select products from our suppliers, list them on Africa Suk, manage orders, and make them available to customers in South Sudan.
                  </p>

                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 pt-2">
                    Our Product Range Includes:
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center gap-2.5 text-gray-900 font-medium">
                        <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0" />
                        <span className="text-sm sm:text-base">{category}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-gray-700 font-medium pt-2">
                    Our selection continues to grow based on customer needs and product availability.
                  </p>
                </section>

                {/* Section: Bringing More Products to South Sudan */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2.5 flex items-center gap-3">
                    <Globe className="h-6 w-6 text-[#004d26] shrink-0" />
                    <span>Bringing More Products to South Sudan</span>
                  </h2>

                  <p className="text-base text-gray-800 leading-relaxed">
                    Finding certain products locally can sometimes be difficult. Africa Suk works with suppliers in regional markets and beyond to source products that customers may not easily find locally.
                  </p>

                  <div className="border border-gray-300 p-4 bg-gray-50">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#004d26] block mb-2">
                      Our Approach
                    </span>
                    <div className="flex flex-wrap items-center gap-2.5 text-base font-bold text-gray-900">
                      {approachSteps.map((step, index) => (
                        <div key={step} className="flex items-center gap-2.5">
                          <span>{step}</span>
                          {index < approachSteps.length - 1 && (
                            <ArrowRight className="h-4 w-4 text-gray-500 shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-base text-gray-800 leading-relaxed">
                    We handle the process so customers can shop from one place without having to search across different sellers and locations.
                  </p>
                </section>

                {/* Section: Built for South Sudan */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2.5 flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-[#004d26] shrink-0" />
                    <span>Built for South Sudan</span>
                  </h2>

                  <p className="text-base text-gray-800 leading-relaxed">
                    Africa Suk is built with the South Sudanese market in mind. We understand that availability, product selection, payment options, and access to goods can be different from larger markets.
                  </p>
                  
                  <p className="text-base text-gray-800 leading-relaxed">
                    Our goal is to gradually build a better online shopping experience that makes more products accessible to customers across South Sudan.
                  </p>
                </section>

                {/* Section: Our Vision */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2.5 flex items-center gap-3">
                    <Telescope className="h-6 w-6 text-[#004d26] shrink-0" />
                    <span>Our Vision</span>
                  </h2>

                  <div className="border-l-4 border-[#004d26] pl-4 py-1 space-y-2">
                    <p className="text-base font-bold text-gray-900">
                      To make online shopping easier and product access better for people across South Sudan.
                    </p>
                    <p className="text-base text-gray-800 leading-relaxed">
                      As Africa Suk grows, we aim to expand our product selection, improve our shopping experience, strengthen our operations, and reach more customers across the country.
                    </p>
                  </div>
                </section>

                {/* Section: Our Approach */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2.5 flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-[#004d26] shrink-0" />
                    <span>Our Approach</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div className="flex items-start gap-3">
                      <Layers className="h-5 w-5 text-[#004d26] shrink-0 mt-1" />
                      <div className="space-y-1">
                        <span className="font-bold text-gray-900 block text-base">Product Selection</span>
                        <p className="text-sm text-gray-800 leading-normal">
                          We look for products that are useful, relevant, and in demand.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Smartphone className="h-5 w-5 text-[#004d26] shrink-0 mt-1" />
                      <div className="space-y-1">
                        <span className="font-bold text-gray-900 block text-base">Simple Shopping</span>
                        <p className="text-sm text-gray-800 leading-normal">
                          We keep the shopping experience straightforward across our website and mobile app.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <HeartHandshake className="h-5 w-5 text-[#004d26] shrink-0 mt-1" />
                      <div className="space-y-1">
                        <span className="font-bold text-gray-900 block text-base">Customer Focus</span>
                        <p className="text-sm text-gray-800 leading-normal">
                          We listen to what customers need and use their feedback to improve Africa Suk.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-[#004d26] shrink-0 mt-1" />
                      <div className="space-y-1">
                        <span className="font-bold text-gray-900 block text-base">Continuous Improvement</span>
                        <p className="text-sm text-gray-800 leading-normal">
                          We continuously improve our products, technology, and operations as the business grows.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section: Africa Suk Today */}
                <section className="space-y-3">
                  <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2.5 flex items-center gap-3">
                    <PackageCheck className="h-6 w-6 text-[#004d26] shrink-0" />
                    <span>Africa Suk Today</span>
                  </h2>
                  <p className="text-base text-gray-800 leading-relaxed">
                    Africa Suk is growing from a small online commerce operation into a broader shopping brand for South Sudan. We are starting with products we can source and manage effectively, then expanding as customer demand and our operations grow. We&apos;re building it step by step.
                  </p>
                </section>

                {/* Section: Actions */}
                <section className="space-y-4 pt-2">
                  <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2.5 flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-[#004d26] shrink-0" />
                    <span>Shop with Confidence</span>
                  </h2>
                  
                  <p className="text-base text-gray-800 leading-relaxed">
                    Discover products available through Africa Suk and find what you need in one place. Can&apos;t find what you are looking for? You can also request a product, and we&apos;ll look into sourcing it when possible.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2 text-sm font-bold text-white bg-[#004d26] px-5 py-3 hover:bg-[#00361a] transition-colors"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Start Shopping</span>
                    </Link>

                    <Link
                      href="/request-product"
                      className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 border-2 border-gray-900 bg-white px-5 py-3 hover:bg-gray-100 transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Request a Product</span>
                    </Link>
                  </div>
                </section>

              </div>

              {/* Sidebar: Clean Wikipedia-style Infobox */}
              <aside className="lg:col-span-4">
                <div className="bg-gray-50 p-6 border border-gray-300 sticky top-6">
                  
                  <div className="text-center pb-4 border-b border-gray-300">
                    <div className="flex justify-center mb-3">
                      <Image
                        src="/icon.png"
                        alt="Africa Suk Logo"
                        width={64}
                        height={64}
                        className="object-contain"
                        priority
                      />
                    </div>
                    <h3 className="font-extrabold text-lg text-gray-900">Africa Suk</h3>
                    <p className="text-sm font-medium text-gray-700">Online Shopping &amp; Regional Sourcing</p>
                  </div>

                  <table className="w-full text-left text-sm mt-3">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <th className="py-2.5 font-bold text-gray-900 w-1/3 align-top">Region</th>
                        <td className="py-2.5 text-gray-900 font-semibold align-top">South Sudan 🇸🇸</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <th className="py-2.5 font-bold text-gray-900 align-top">Model</th>
                        <td className="py-2.5 text-gray-800 font-medium align-top">Source → Select → List → Sell → Deliver</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <th className="py-2.5 font-bold text-gray-900 align-top">Platforms</th>
                        <td className="py-2.5 text-gray-800 font-medium align-top">Website &amp; Mobile App</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <th className="py-2.5 font-bold text-gray-900 align-top">Coverage</th>
                        <td className="py-2.5 text-gray-800 font-medium align-top">Everyday essentials, Tech, Fashion, Home &amp; more</td>
                      </tr>
                      <tr>
                        <th className="py-2.5 font-bold text-gray-900 align-top">Services</th>
                        <td className="py-2.5 text-gray-800 font-medium align-top">On-demand Product Requests</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="pt-4 mt-2 border-t border-gray-300 text-center">
                    <p className="italic text-xs font-semibold text-gray-700">
                      &ldquo;Making Shopping Easier in South Sudan.&rdquo;
                    </p>
                  </div>

                </div>
              </aside>

            </div>

          </div>
        </Container>
      </div>
    </>
  );
}