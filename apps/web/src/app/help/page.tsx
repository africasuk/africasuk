import Link from "next/link";
import {
  ShoppingBag,
  PackageCheck,
  Truck,
  CreditCard,
  RotateCcw,
  MessageSquare,
  Mail,
  ListCheck,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  Clock,
} from "lucide-react";

import Container from "@/components/layout/Container";
import HelpHero from "@/components/help/HelpHero";

export default function HelpPage() {
  return (
    <>
      <div className="py-10 sm:py-16 bg-white">
        <Container>
          <div className="mx-auto max-w-5xl">
            
            {/* Header */}
            <HelpHero />

            <div className="grid gap-12 lg:grid-cols-12">
              
              {/* Main Article Column */}
              <div className="lg:col-span-8 space-y-10 text-gray-800 leading-relaxed text-sm sm:text-base">
                
                {/* Section: Orders */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <ShoppingBag className="h-5 w-5 text-[#004d26]" />
                    <span>Orders</span>
                  </h2>
                  <ul className="space-y-2.5 text-gray-700 pl-1">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Track your order status.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>View your order history.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Cancel an order (before processing begins).</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Request assistance with your order.</span>
                    </li>
                  </ul>
                </section>

                {/* Section: Product Requests */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <PackageCheck className="h-5 w-5 text-[#004d26]" />
                    <span>Product Requests</span>
                  </h2>
                  <p className="text-gray-600">
                    Can&apos;t find the product you&apos;re looking for? Visit our Product Request page and tell us what you need.
                  </p>
                  <p className="text-gray-600">
                    Once we source and add your requested product to our catalog, we&apos;ll notify you so you can place your order through your account.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <Link
                      href="/request-product"
                      className="inline-flex items-center gap-2 text-xs font-bold text-white bg-[#004d26] px-4 py-2.5 rounded-full hover:bg-[#00361a] transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Request Product</span>
                    </Link>

                    <Link
                      href="/account/requests"
                      className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 bg-gray-100 px-4 py-2.5 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <ListCheck className="h-3.5 w-3.5" />
                      <span>My Product Requests</span>
                    </Link>
                  </div>
                </section>

                {/* Section: Shipping & Delivery */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <Truck className="h-5 w-5 text-[#004d26]" />
                    <span>Shipping &amp; Delivery</span>
                  </h2>
                  <p className="text-gray-600">
                    We source products from international suppliers and arrange delivery to South Sudan. Delivery times may vary depending on:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 pl-1 text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#004d26] shrink-0" />
                      <span>Product availability</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#004d26] shrink-0" />
                      <span>Supplier processing time</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#004d26] shrink-0" />
                      <span>International shipping</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#004d26] shrink-0" />
                      <span>Customs clearance</span>
                    </li>
                  </ul>
                  <p className="text-xs text-gray-500 italic pt-1">
                    Estimated delivery times will be shared during the ordering process whenever available.
                  </p>
                </section>

                {/* Section: Payments */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <CreditCard className="h-5 w-5 text-[#004d26]" />
                    <span>Payments</span>
                  </h2>
                  <p className="text-gray-600">
                    AfricaSuk accepts supported payment methods displayed during checkout. If you&apos;re experiencing payment issues, please contact our support team.
                  </p>
                </section>

                {/* Section: Returns & Refunds */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <RotateCcw className="h-5 w-5 text-[#004d26]" />
                    <span>Returns &amp; Refunds</span>
                  </h2>
                  <p className="text-gray-600">
                    Return and refund eligibility depends on the product type and supplier policies.
                  </p>
                  <p className="text-gray-600">
                    For complete details, please review our{" "}
                    <Link href="/returns" className="font-semibold text-[#004d26] underline underline-offset-2 hover:text-[#00361a]">
                      Refund Policy
                    </Link>{" "}
                    or contact customer support before initiating a return.
                  </p>
                </section>

                {/* Section: Need More Help? */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <MessageSquare className="h-5 w-5 text-[#004d26]" />
                    <span>Need More Help?</span>
                  </h2>
                  <p className="text-gray-600">
                    If you couldn&apos;t find the answer you&apos;re looking for, we&apos;re happy to help.
                  </p>

                  <div className="space-y-2 pt-1">
                    <h3 className="font-bold text-gray-900 text-sm">Customer Support</h3>
                    <p className="text-gray-700 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[#004d26]" />
                      <span>Email: <strong className="text-gray-900">customer@africasuk.com</strong></span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Our support team will respond as soon as possible during business hours.
                    </p>
                  </div>

                  {/* Checklist */}
                  <div className="pt-2">
                    <h3 className="font-bold text-gray-900 text-sm mb-2">Before Contacting Us</h3>
                    <p className="text-xs text-gray-500 mb-3">To help us assist you faster, please include:</p>
                    <ul className="space-y-2 text-gray-700 text-xs sm:text-sm pl-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#004d26] shrink-0" />
                        <span>Your order number (if applicable)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#004d26] shrink-0" />
                        <span>Your registered email address</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#004d26] shrink-0" />
                        <span>A clear description of the issue</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#004d26] shrink-0" />
                        <span>Photos or screenshots (if relevant)</span>
                      </li>
                    </ul>
                  </div>
                </section>

              </div>

              {/* Sidebar: Wikipedia Infobox */}
              <aside className="lg:col-span-4">
                <div className="bg-gray-50/80 p-5 text-xs space-y-4 rounded-lg sticky top-6 border border-gray-200/60">
                  
                  <div className="text-center pb-3 border-b border-gray-200">
                    <div className="flex justify-center mb-2">
                      <HelpCircle className="h-8 w-8 text-[#004d26]" />
                    </div>
                    <h3 className="font-bold text-sm text-gray-900">Support Desk</h3>
                    <p className="text-gray-500 text-[11px]">AfricaSuk Customer Care</p>
                  </div>

                  <table className="w-full text-left">
                    <tbody>
                      <tr className="border-b border-gray-200/80">
                        <th className="py-2 font-semibold text-gray-600 w-1/3">Email</th>
                        <td className="py-2 text-gray-900 font-mono">customer@africasuk.com</td>
                      </tr>
                      <tr className="border-b border-gray-200/80">
                        <th className="py-2 font-semibold text-gray-600">Hours</th>
                        <td className="py-2 text-gray-900 flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span>Standard Business Hours</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200/80">
                        <th className="py-2 font-semibold text-gray-600">Region</th>
                        <td className="py-2 text-gray-900">South Sudan 🇸🇸</td>
                      </tr>
                      <tr>
                        <th className="py-2 font-semibold text-gray-600">Fastest Help</th>
                        <td className="py-2 text-gray-900">Include Order # &amp; Email</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="pt-2 border-t border-gray-200 text-center">
                    <p className="italic text-[11px] text-gray-500">
                      &ldquo;Here to make your shopping experience simple and smooth.&rdquo;
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