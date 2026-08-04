import Link from "next/link";
import {
  Globe,
  UserCheck,
  Package,
  Tag,
  ShoppingBag,
  CreditCard,
  Truck,
  PackageCheck,
  RotateCcw,
  User,
  AlertTriangle,
  Copyright,
  Share2,
  ShieldAlert,
  RefreshCw,
  Mail,
  MapPin,
  CheckCircle2,
  Scale,
} from "lucide-react";

import Container from "@/components/layout/Container";
import TermsHero from "@/components/terms/TermsHero";

export default function TermsPage() {
  return (
    <>
      <div className="py-10 sm:py-16 bg-white">
        <Container>
          <div className="mx-auto max-w-5xl">
            
            {/* Header */}
            <TermsHero />

            <div className="grid gap-12 lg:grid-cols-12">
              
              {/* Main Article Column */}
              <div className="lg:col-span-8 space-y-10 text-gray-800 leading-relaxed text-sm sm:text-base">
                
                {/* 1. About AfricaSuk */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <Globe className="h-5 w-5 text-[#004d26]" />
                    <span>1. About AfricaSuk</span>
                  </h2>
                  <p className="text-gray-600">
                    AfricaSuk is an international shopping and product sourcing platform that helps customers in South Sudan access authentic products from suppliers around the world.
                  </p>
                </section>

                {/* 2. Eligibility */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <UserCheck className="h-5 w-5 text-[#004d26]" />
                    <span>2. Eligibility</span>
                  </h2>
                  <p className="text-gray-600">
                    You must be at least 18 years old or have permission from a parent or legal guardian to use our services. By using AfricaSuk, you confirm that the information you provide is accurate and up to date.
                  </p>
                </section>

                {/* 3. Products */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <Package className="h-5 w-5 text-[#004d26]" />
                    <span>3. Products</span>
                  </h2>
                  <p className="text-gray-600">
                    We make every effort to ensure product descriptions, images, prices, and specifications are accurate. However:
                  </p>
                  <ul className="space-y-2 text-gray-700 pl-1">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Product images may differ slightly from the actual product.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Specifications may change without prior notice.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Availability is subject to supplier inventory.</span>
                    </li>
                  </ul>
                </section>

                {/* 4. Pricing */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <Tag className="h-5 w-5 text-[#004d26]" />
                    <span>4. Pricing</span>
                  </h2>
                  <p className="text-gray-600">
                    Prices displayed on AfricaSuk are subject to change without notice. Additional costs such as shipping, customs duties, taxes, or service fees may apply depending on the product and destination.
                  </p>
                </section>

                {/* 5. Orders */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <ShoppingBag className="h-5 w-5 text-[#004d26]" />
                    <span>5. Orders</span>
                  </h2>
                  <p className="text-gray-600">
                    Submitting an order does not guarantee acceptance. AfricaSuk reserves the right to:
                  </p>
                  <ul className="space-y-2 text-gray-700 pl-1">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Accept or decline any order.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Cancel orders due to pricing errors.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Cancel orders when products become unavailable.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Request additional verification before processing an order.</span>
                    </li>
                  </ul>
                </section>

                {/* 6. Payments */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <CreditCard className="h-5 w-5 text-[#004d26]" />
                    <span>6. Payments</span>
                  </h2>
                  <p className="text-gray-600">
                    Payment must be completed using the payment methods available on AfricaSuk. Orders may not be processed until payment has been successfully confirmed.
                  </p>
                </section>

                {/* 7. Shipping & Delivery */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <Truck className="h-5 w-5 text-[#004d26]" />
                    <span>7. Shipping &amp; Delivery</span>
                  </h2>
                  <p className="text-gray-600">
                    Delivery estimates are provided for guidance only. Delivery times may vary due to supplier processing, international shipping, customs clearance, weather conditions, or other circumstances beyond our control.
                  </p>
                  <p className="text-xs text-gray-500 italic">
                    AfricaSuk is not responsible for delays caused by third-party logistics providers or customs authorities.
                  </p>
                </section>

                {/* 8. Product Requests */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <PackageCheck className="h-5 w-5 text-[#004d26]" />
                    <span>8. Product Requests</span>
                  </h2>
                  <p className="text-gray-600">
                    Customers may request products that are not currently listed on AfricaSuk. Submitting a request does not guarantee that the requested product will become available.
                  </p>
                  <p className="text-gray-600">
                    If we successfully source the requested product, it may be added to our catalog, allowing customers to place an order through the website.
                  </p>
                </section>

                {/* 9. Returns & Refunds */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <RotateCcw className="h-5 w-5 text-[#004d26]" />
                    <span>9. Returns &amp; Refunds</span>
                  </h2>
                  <p className="text-gray-600">
                    Returns and refunds are handled in accordance with our{" "}
                    <Link href="/returns" className="font-semibold text-[#004d26] underline underline-offset-2 hover:text-[#00361a]">
                      Refund Policy
                    </Link>. Some products may not be eligible for return due to supplier restrictions or product type.
                  </p>
                </section>

                {/* 10. User Accounts */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <User className="h-5 w-5 text-[#004d26]" />
                    <span>10. User Accounts</span>
                  </h2>
                  <p className="text-gray-600">
                    You are responsible for maintaining the confidentiality of your account credentials. You agree to notify AfricaSuk immediately if you suspect unauthorized access to your account.
                  </p>
                </section>

                {/* 11. Acceptable Use */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <AlertTriangle className="h-5 w-5 text-[#004d26]" />
                    <span>11. Acceptable Use</span>
                  </h2>
                  <p className="text-gray-600">You agree not to:</p>
                  <ul className="space-y-2 text-gray-700 pl-1">
                    <li className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#004d26] shrink-0" />
                      <span>Violate any applicable laws.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#004d26] shrink-0" />
                      <span>Use AfricaSuk for fraudulent activities.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#004d26] shrink-0" />
                      <span>Interfere with the operation of the website.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#004d26] shrink-0" />
                      <span>Attempt unauthorized access to our systems.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#004d26] shrink-0" />
                      <span>Upload malicious software or harmful content.</span>
                    </li>
                  </ul>
                </section>

                {/* 12. Intellectual Property */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <Copyright className="h-5 w-5 text-[#004d26]" />
                    <span>12. Intellectual Property</span>
                  </h2>
                  <p className="text-gray-600">
                    All content on AfricaSuk, including text, graphics, logos, images, icons, and software, is owned by or licensed to AfricaSuk and is protected by applicable intellectual property laws. You may not copy, reproduce, or distribute our content without prior written permission.
                  </p>
                </section>

                {/* 13. Third-Party Services */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <Share2 className="h-5 w-5 text-[#004d26]" />
                    <span>13. Third-Party Services</span>
                  </h2>
                  <p className="text-gray-600">
                    AfricaSuk may use third-party suppliers, payment providers, logistics companies, and other service providers. We are not responsible for the policies or actions of these third parties.
                  </p>
                </section>

                {/* 14. Limitation of Liability */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <ShieldAlert className="h-5 w-5 text-[#004d26]" />
                    <span>14. Limitation of Liability</span>
                  </h2>
                  <p className="text-gray-600">
                    To the fullest extent permitted by law, AfricaSuk shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services.
                  </p>
                </section>

                {/* 15. Changes to These Terms */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <RefreshCw className="h-5 w-5 text-[#004d26]" />
                    <span>15. Changes to These Terms</span>
                  </h2>
                  <p className="text-gray-600">
                    We may update these Terms of Service from time to time. The latest version will always be available on this page, and continued use of AfricaSuk constitutes acceptance of the updated terms.
                  </p>
                </section>

                {/* 16. Contact Us */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <Mail className="h-5 w-5 text-[#004d26]" />
                    <span>16. Contact Us</span>
                  </h2>
                  <p className="text-gray-600">
                    If you have any questions regarding these Terms of Service, please contact us at:
                  </p>
                  <p className="font-mono text-sm text-gray-900 font-semibold">
                    customer@africasuk.com
                  </p>
                </section>

                {/* 17. Service Availability */}
                <section className="space-y-3 pt-2">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <MapPin className="h-5 w-5 text-[#004d26]" />
                    <span>17. Service Availability</span>
                  </h2>
                  <p className="text-gray-600">
                    At this time, AfricaSuk accepts orders only for customers located within <strong className="text-gray-900">Juba, South Sudan</strong>.
                  </p>
                  <p className="text-gray-600">
                    If you are located outside Juba but within South Sudan, standard ordering is not yet available. You may instead submit a request through our{" "}
                    <Link href="/request-product" className="font-semibold text-[#004d26] underline underline-offset-2 hover:text-[#00361a]">
                      Product Request page
                    </Link>, and our team will review your request and contact you regarding availability and delivery options.
                  </p>
                  <p className="text-gray-600">
                    As AfricaSuk continues to expand, we plan to extend ordering and delivery services to additional cities and regions across South Sudan. We encourage customers outside Juba to check our website regularly for future service updates.
                  </p>
                </section>

              </div>

              {/* Sidebar: Wikipedia Infobox */}
              <aside className="lg:col-span-4">
                <div className="bg-gray-50/80 p-5 text-xs space-y-4 rounded-lg sticky top-6 border border-gray-200/60">
                  
                  <div className="text-center pb-3 border-b border-gray-200">
                    <div className="flex justify-center mb-2">
                      <Scale className="h-8 w-8 text-[#004d26]" />
                    </div>
                    <h3 className="font-bold text-sm text-gray-900">Terms Overview</h3>
                    <p className="text-gray-500 text-[11px]">AfricaSuk Legal Framework</p>
                  </div>

                  <table className="w-full text-left">
                    <tbody>
                      <tr className="border-b border-gray-200/80">
                        <th className="py-2 font-semibold text-gray-600 w-1/3">Updated</th>
                        <td className="py-2 text-gray-900 font-medium">August 2026</td>
                      </tr>
                      <tr className="border-b border-gray-200/80">
                        <th className="py-2 font-semibold text-gray-600">Coverage</th>
                        <td className="py-2 text-gray-900">Juba, South Sudan 🇸🇸</td>
                      </tr>
                      <tr className="border-b border-gray-200/80">
                        <th className="py-2 font-semibold text-gray-600">Min. Age</th>
                        <td className="py-2 text-gray-900">18 Years or Guardian Consent</td>
                      </tr>
                      <tr>
                        <th className="py-2 font-semibold text-gray-600">Legal Contact</th>
                        <td className="py-2 text-gray-900 font-mono">customer@africasuk.com</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="pt-2 border-t border-gray-200 text-center">
                    <p className="italic text-[11px] text-gray-500">
                      &ldquo;Ensuring safe, legal, and transparent international commerce in South Sudan.&rdquo;
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