import Link from "next/link";
import {
  Globe,
  ShoppingBag,
  CheckCircle2,
  Target,
  Rocket,
  Telescope,
  Tag,
  ShieldCheck,
  Search,
  PackageCheck,
  Package,
  FileText,
  ClipboardList,
  Handshake,
  Mail,
  Sparkles,
} from "lucide-react";

import Container from "@/components/layout/Container";
import AboutHero from "./AboutHero";

export default function AboutPage() {
  return (
    <>
      <div className="py-10 sm:py-16 bg-white">
        <Container>
          <div className="mx-auto max-w-5xl">
            
            {/* Header */}
            <AboutHero />

            <div className="grid gap-12 lg:grid-cols-12">
              
              {/* Main Column: Wikipedia-style layout with zero card borders */}
              <div className="lg:col-span-8 space-y-10 text-gray-800 leading-relaxed text-sm sm:text-base">
                
                {/* Intro Overview */}
              <section className="space-y-4">
                <p className="text-base leading-relaxed text-gray-700 sm:text-lg">
                  <strong className="font-bold text-gray-900">AfricaSuk</strong> is an international shopping and product sourcing platform focused on making products from around the world more accessible to customers in South Sudan.
                </p>

                <p className="text-gray-600">
                  We source products from international suppliers and bring them closer to customers in South Sudan. Whether you&apos;re looking for electronics, fashion, beauty products, home essentials, accessories, or other hard-to-find items, AfricaSuk helps connect you with products that may not be readily available in the local market.
                </p>
              </section>

                <hr className="border-gray-200" />

                {/* Section: What We Do */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <ShoppingBag className="h-5 w-5 text-[#004d26]" />
                    <span>What We Do</span>
                  </h2>
                  <ul className="space-y-3 text-gray-700 pl-1">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <span>Source authentic products from trusted international suppliers.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <span>Import products that are not readily available in South Sudan.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <span>Carefully review and verify products before offering them to customers.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <span>Offer personalized product sourcing for special customer requests.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <span>Continuously expand our catalog based on customer demand.</span>
                    </li>
                  </ul>
                </section>

              {/* Section: Mission & Vision */}
                  <section className="space-y-6">
                    <h2 className="flex items-center gap-2.5 border-b border-gray-200 pb-2 text-xl font-bold text-gray-900">
                      <Target className="h-5 w-5 text-[#004d26]" />
                      <span>Mission &amp; Vision</span>
                    </h2>

                    <div className="space-y-2 border-l-2 border-[#004d26] pl-3">
                      <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-900">
                        <Rocket className="h-4 w-4 text-[#004d26]" />
                        Our Mission
                      </h3>

                      <p className="text-gray-600">
                        To make international shopping more accessible for customers in South Sudan by sourcing genuine products from around the world and providing a simple, transparent, and reliable shopping experience.
                      </p>
                    </div>

                    <div className="space-y-2 border-l-2 border-emerald-600 pl-3">
                      <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-900">
                        <Telescope className="h-4 w-4 text-emerald-600" />
                        Our Vision
                      </h3>

                      <p className="text-gray-600">
                        To become South Sudan&apos;s leading destination for international shopping and product sourcing, while expanding our services to connect more customers across Africa with products from around the world.
                      </p>
                    </div>
                  </section>

                {/* Section: Why Choose AfricaSuk */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <Sparkles className="h-5 w-5 text-[#004d26]" />
                    <span>Why Choose AfricaSuk?</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex items-start gap-3">
                      <Tag className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-gray-900 block text-sm">Authentic Products</span>
                        <span className="text-xs text-gray-500">100% genuine items from global suppliers.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <ShieldCheck className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-gray-900 block text-sm">Safe &amp; Transparent</span>
                        <span className="text-xs text-gray-500">No hidden fees or unexpected costs.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Search className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-gray-900 block text-sm">Personalized Sourcing</span>
                        <span className="text-xs text-gray-500">We source items directly upon request.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <PackageCheck className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-gray-900 block text-sm">End-to-End Delivery</span>
                        <span className="text-xs text-gray-500">Dedicated support from order to delivery.</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section: Request Product */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <Package className="h-5 w-5 text-[#004d26]" />
                    <span>Can&apos;t Find What You&apos;re Looking For?</span>
                  </h2>
                  <p className="text-gray-600">
                    If the product you&apos;re looking for isn&apos;t available on AfricaSuk, our sourcing team will review your request and work to find it from trusted international suppliers.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <Link
                      href="/request-product"
                      className="inline-flex items-center gap-2 text-xs font-bold text-white bg-[#004d26] px-4 py-2.5 rounded-full hover:bg-[#00361a] transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Request a Product</span>
                    </Link>

                    <Link
                      href="/account/requests"
                      className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 bg-gray-100 px-4 py-2.5 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <ClipboardList className="h-4 w-4" />
                      <span>My Requests</span>
                    </Link>
                  </div>
                </section>

                {/* Section: Partnership */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <Handshake className="h-5 w-5 text-[#004d26]" />
                    <span>Partner With AfricaSuk</span>
                  </h2>
                  <p className="text-gray-600">
                    Are you a manufacturer, distributor, or brand looking to make your products available to customers in South Sudan? Contact us at:
                  </p>
                  <p className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#004d26]" />
                    <span>customer@africasuk.com</span>
                  </p>
                </section>

              </div>

              {/* Sidebar: Wikipedia-style Infobox */}
              <aside className="lg:col-span-4">
                <div className="bg-gray-50/80 p-5 text-xs space-y-4 rounded-lg sticky top-6 border border-gray-200/60">
                  
                  <div className="text-center pb-3 border-b border-gray-200">
                    <div className="flex justify-center mb-2">
                      <Globe className="h-8 w-8 text-[#004d26]" />
                    </div>
                    <h3 className="font-bold text-sm text-gray-900">AfricaSuk</h3>
                    <p className="text-gray-500 text-[11px]">International Shopping &amp; Sourcing</p>
                  </div>

                  <table className="w-full text-left">
                    <tbody>
                      <tr className="border-b border-gray-200/80">
                        <th className="py-2 font-semibold text-gray-600 w-1/3">Region</th>
                        <td className="py-2 text-gray-900 font-medium">South Sudan 🇸🇸</td>
                      </tr>
                      <tr className="border-b border-gray-200/80">
                        <th className="py-2 font-semibold text-gray-600">Focus</th>
                        <td className="py-2 text-gray-900">Global Product Sourcing</td>
                      </tr>
                      <tr className="border-b border-gray-200/80">
                        <th className="py-2 font-semibold text-gray-600">Categories</th>
                        <td className="py-2 text-gray-900">Electronics, Fashion, Beauty, Home</td>
                      </tr>
                      <tr className="border-b border-gray-200/80">
                        <th className="py-2 font-semibold text-gray-600">Service</th>
                        <td className="py-2 text-gray-900">Personalized Requests</td>
                      </tr>
                      <tr>
                        <th className="py-2 font-semibold text-gray-600">Contact</th>
                        <td className="py-2 text-gray-900 font-mono">customer@africasuk.com</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="pt-2 border-t border-gray-200 text-center">
                    <p className="italic text-[11px] text-gray-500">
                      &ldquo;Bringing the products you need from around the world to your doorstep in South Sudan.&rdquo;
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