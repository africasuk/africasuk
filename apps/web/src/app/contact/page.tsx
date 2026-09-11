import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  PackageSearch,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  UserCheck,
  FileText,
  Camera,
  ArrowRight,
} from "lucide-react";

import Container from "@/components/layout/Container";
import ContactHero from "@/components/contact/ContactHero";

export default function ContactPage() {
  return (
    <>
      <div className="bg-white py-10 sm:py-16 text-gray-900">
        <Container>
          <div className="mx-auto max-w-5xl">
            {/* Header */}
            <ContactHero />

            <div className="grid gap-12 lg:grid-cols-12 items-start mt-6">
              {/* Main Article Column */}
              <div className="space-y-10 text-base leading-relaxed text-gray-800 lg:col-span-8">
                
                {/* Customer Support */}
                <section className="space-y-3">
                  <h2 className="flex items-center gap-2.5 border-b border-gray-300 pb-2.5 text-2xl font-bold text-gray-900">
                    <Mail className="h-6 w-6 text-[#004d26] shrink-0" />
                    <span>Customer Support</span>
                  </h2>

                  <p className="text-gray-800">
                    For questions about your account, orders, products,
                    deliveries, returns, refunds, or product requests:
                  </p>

                  <div className="border border-gray-300 p-4 bg-gray-50">
                    <p className="font-mono text-base font-bold text-gray-900">
                      <span className="text-[#004d26] mr-2">Email:</span>
                      <a
                        href="mailto:customer@africasuk.com"
                        className="underline underline-offset-4 hover:text-[#004d26]"
                      >
                        customer@africasuk.com
                      </a>
                    </p>
                  </div>
                </section>

                {/* Business & Partnerships */}
                <section className="space-y-3">
                  <h2 className="flex items-center gap-2.5 border-b border-gray-300 pb-2.5 text-2xl font-bold text-gray-900">
                    <Building2 className="h-6 w-6 text-[#004d26] shrink-0" />
                    <span>Business &amp; Partnerships</span>
                  </h2>

                  <p className="text-gray-800">
                    For business inquiries, product supply opportunities,
                    logistics, technology, or other commercial partnerships with
                    Africa Suk:
                  </p>

                  <div className="border border-gray-300 p-4 bg-gray-50">
                    <p className="font-mono text-base font-bold text-gray-900">
                      <span className="text-[#004d26] mr-2">Email:</span>
                      <a
                        href="mailto:business@africasuk.com"
                        className="underline underline-offset-4 hover:text-[#004d26]"
                      >
                        business@africasuk.com
                      </a>
                    </p>
                  </div>
                </section>

                {/* Office Location & Hours */}
                <section className="space-y-4">
                  <h2 className="flex items-center gap-2.5 border-b border-gray-300 pb-2.5 text-2xl font-bold text-gray-900">
                    <MapPin className="h-6 w-6 text-[#004d26] shrink-0" />
                    <span>Office Location &amp; Hours</span>
                  </h2>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2 border border-gray-300 p-4 bg-gray-50">
                      <h3 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-gray-900">
                        <MapPin className="h-4 w-4 text-[#004d26]" />
                        <span>Office Location</span>
                      </h3>

                      <p className="font-bold text-base text-gray-900">
                        Juba, South Sudan 🇸🇸
                      </p>

                      <p className="text-sm text-gray-700 leading-normal">
                        Africa Suk operates centrally in Juba. Additional
                        distribution hubs and service offices may be added as our operations expand.
                      </p>
                    </div>

                    <div className="space-y-2 border border-gray-300 p-4 bg-gray-50">
                      <h3 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-gray-900">
                        <Clock className="h-4 w-4 text-[#004d26]" />
                        <span>Business Hours</span>
                      </h3>

                      <div className="space-y-1 text-sm text-gray-800">
                        <p>
                          <strong className="text-gray-900">Monday – Saturday:</strong>{" "}
                          9:00 AM – 6:00 PM (EAT)
                        </p>
                        <p>
                          <strong className="text-gray-900">Sunday:</strong>{" "}
                          Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Before Contacting Us */}
                <section className="space-y-4">
                  <h2 className="flex items-center gap-2.5 border-b border-gray-300 pb-2.5 text-2xl font-bold text-gray-900">
                    <CheckCircle2 className="h-6 w-6 text-[#004d26] shrink-0" />
                    <span>Before Contacting Us</span>
                  </h2>

                  <p className="text-gray-800">
                    To help us resolve your request promptly, please include the
                    following details in your message:
                  </p>

                  <ul className="space-y-2.5 pl-1 text-base text-gray-800">
                    <li className="flex items-center gap-3">
                      <UserCheck className="h-5 w-5 shrink-0 text-[#004d26]" />
                      <span>Your full name</span>
                    </li>

                    <li className="flex items-center gap-3">
                      <Mail className="h-5 w-5 shrink-0 text-[#004d26]" />
                      <span>Your registered account email address</span>
                    </li>

                    <li className="flex items-center gap-3">
                      <FileText className="h-5 w-5 shrink-0 text-[#004d26]" />
                      <span>Your order number (if applicable)</span>
                    </li>

                    <li className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 shrink-0 text-[#004d26]" />
                      <span>A clear description of your issue or request</span>
                    </li>

                    <li className="flex items-center gap-3">
                      <Camera className="h-5 w-5 shrink-0 text-[#004d26]" />
                      <span>Relevant photographs, screenshots, or packaging labels</span>
                    </li>
                  </ul>
                </section>

                {/* Need a Product? */}
                <section className="space-y-4">
                  <h2 className="flex items-center gap-2.5 border-b border-gray-300 pb-2.5 text-2xl font-bold text-gray-900">
                    <PackageSearch className="h-6 w-6 text-[#004d26] shrink-0" />
                    <span>Need a Product?</span>
                  </h2>

                  <p className="text-gray-800">
                    Can&apos;t find the product you are looking for in our store?
                    Submit a product request and our sourcing team will check
                    availability through regional and international suppliers.
                  </p>

                  <div className="pt-1">
                    <Link
                      href="/request-product"
                      className="inline-flex items-center gap-2 bg-[#004d26] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#00361a]"
                    >
                      <span>Request a Product</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <p className="text-sm italic text-gray-600">
                    Note: Product requests do not guarantee availability. If we
                    can source the requested product, we will contact you with
                    pricing and delivery options before an order is placed.
                  </p>
                </section>

                {/* Response Time */}
                <section className="space-y-3 pt-2">
                  <h2 className="flex items-center gap-2.5 border-b border-gray-300 pb-2.5 text-2xl font-bold text-gray-900">
                    <Sparkles className="h-6 w-6 text-[#004d26] shrink-0" />
                    <span>Response Time</span>
                  </h2>

                  <p className="text-gray-800">
                    We aim to respond to all inquiries within business hours
                    (Monday–Saturday, 9:00 AM – 6:00 PM EAT). Response times may
                    vary slightly depending on the volume and technical complexity of inquiries.
                  </p>

                  <div className="flex items-center gap-2.5 pt-2 text-base font-bold text-[#004d26]">
                    <ShieldCheck className="h-5 w-5 shrink-0" />
                    <span>Thank you for choosing Africa Suk. Shop with Confidence.</span>
                  </div>
                </section>
              </div>

              {/* Sidebar: Wikipedia-Style Infobox */}
              <aside className="lg:col-span-4">
                <div className="sticky top-6 border border-gray-300 bg-gray-50 p-6 space-y-4">
                  <div className="border-b border-gray-300 pb-4 text-center">
                    <div className="mb-3 flex justify-center">
                      <Image
                        src="/icon.png"
                        alt="Africa Suk Logo"
                        width={60}
                        height={60}
                        className="object-contain"
                        priority
                      />
                    </div>

                    <h3 className="text-lg font-extrabold text-gray-900">
                      Africa Suk
                    </h3>

                    <p className="text-xs font-semibold text-gray-700">
                      Customer Service &amp; Communications
                    </p>
                  </div>

                  <table className="w-full text-left text-sm mt-3">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <th className="w-1/3 py-2.5 font-bold text-gray-900 align-top">
                          Support
                        </th>
                        <td className="py-2.5 font-mono text-xs text-gray-900 align-top font-semibold">
                          customer@africasuk.com
                        </td>
                      </tr>

                      <tr className="border-b border-gray-200">
                        <th className="py-2.5 font-bold text-gray-900 align-top">
                          Business
                        </th>
                        <td className="py-2.5 font-mono text-xs text-gray-900 align-top font-semibold">
                          business@africasuk.com
                        </td>
                      </tr>

                      <tr className="border-b border-gray-200">
                        <th className="py-2.5 font-bold text-gray-900 align-top">
                          Hours
                        </th>
                        <td className="py-2.5 text-gray-800 font-medium align-top">
                          Mon–Sat (9 AM–6 PM EAT)
                        </td>
                      </tr>

                      <tr className="border-b border-gray-200">
                        <th className="py-2.5 font-bold text-gray-900 align-top">
                          Location
                        </th>
                        <td className="py-2.5 text-gray-900 font-semibold align-top">
                          Juba, South Sudan 🇸🇸
                        </td>
                      </tr>

                      <tr>
                        <th className="py-2.5 font-bold text-gray-900 align-top">
                          Sourcing
                        </th>
                        <td className="py-2.5 align-top">
                          <Link
                            href="/request-product"
                            className="font-bold text-[#004d26] underline hover:text-[#00361a]"
                          >
                            Request a Product
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="border-t border-gray-300 pt-3 text-center">
                    <p className="text-xs italic font-medium text-gray-700">
                      &ldquo;Shop with Confidence. Direct support for customers across South Sudan.&rdquo;
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