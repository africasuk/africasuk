
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
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
    <div className="bg-white py-10 text-gray-900 sm:py-16">
      <Container>
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <ContactHero />

          <div className="mt-6 grid items-start gap-12 lg:grid-cols-12">
            {/* Main Content */}
            <div className="space-y-10 text-base leading-relaxed text-gray-800 lg:col-span-8">

              {/* Customer Support */}
              <section className="space-y-3">
                <h2 className="flex items-center gap-2.5 border-b border-gray-300 pb-2.5 text-2xl font-bold text-gray-900">
                  <Mail className="h-6 w-6 shrink-0 text-[#004d26]" />
                  Customer Support
                </h2>

                <p>
                  For questions about your account, orders, products,
                  deliveries, returns, refunds, or product requests:
                </p>

                <div className="border border-gray-300 bg-gray-50 p-4">
                  <p className="break-all font-mono text-base font-bold text-gray-900">
                    <span className="mr-2 text-[#004d26]">Email:</span>
                    <a
                      href="mailto:customer@africasuk.com"
                      className="underline underline-offset-4 hover:text-[#004d26]"
                    >
                      customer@africasuk.com
                    </a>
                  </p>
                </div>
              </section>

              {/* Phone & WhatsApp */}
              <section className="space-y-3">
                <h2 className="flex items-center gap-2.5 border-b border-gray-300 pb-2.5 text-2xl font-bold text-gray-900">
                  <Phone className="h-6 w-6 shrink-0 text-[#004d26]" />
                  Phone & WhatsApp Support
                </h2>

                <p>
                  You can also contact our team directly using our
                  official phone numbers:
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <a
                    href="https://wa.me/211982851779"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-gray-300 bg-gray-50 p-4 transition-colors hover:border-[#004d26]"
                  >
                    <p className="text-sm font-semibold text-gray-600">
                      WhatsApp
                    </p>
                    <p className="mt-1 text-base font-bold text-[#004d26]">
                      +211 982 851 779
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Chat with our team
                    </p>
                  </a>

                  <a
                    href="tel:+211923866290"
                    className="border border-gray-300 bg-gray-50 p-4 transition-colors hover:border-[#004d26]"
                  >
                    <p className="text-sm font-semibold text-gray-600">
                      Phone
                    </p>
                    <p className="mt-1 text-base font-bold text-[#004d26]">
                      +211 923 866 290
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Call our team
                    </p>
                  </a>
                </div>
              </section>

              {/* Business & Partnerships */}
              <section className="space-y-3">
                <h2 className="flex items-center gap-2.5 border-b border-gray-300 pb-2.5 text-2xl font-bold text-gray-900">
                  <Building2 className="h-6 w-6 shrink-0 text-[#004d26]" />
                  Business &amp; Partnerships
                </h2>

                <p>
                  For business inquiries, product supply opportunities,
                  logistics, technology, or other commercial partnerships
                  with Africa Suk:
                </p>

                <div className="border border-gray-300 bg-gray-50 p-4">
                  <p className="break-all font-mono text-base font-bold text-gray-900">
                    <span className="mr-2 text-[#004d26]">Email:</span>
                    <a
                      href="mailto:business@africasuk.com"
                      className="underline underline-offset-4 hover:text-[#004d26]"
                    >
                      business@africasuk.com
                    </a>
                  </p>
                </div>
              </section>

              {/* Office Location & Availability */}
              <section className="space-y-4">
                <h2 className="flex items-center gap-2.5 border-b border-gray-300 pb-2.5 text-2xl font-bold text-gray-900">
                  <MapPin className="h-6 w-6 shrink-0 text-[#004d26]" />
                  Office Location &amp; Availability
                </h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Location */}
                  <div className="space-y-2 border border-gray-300 bg-gray-50 p-4">
                    <h3 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-gray-900">
                      <MapPin className="h-4 w-4 text-[#004d26]" />
                      Office Location
                    </h3>

                    <p className="text-base font-bold text-gray-900">
                      Juba, South Sudan 🇸🇸
                    </p>

                    <p className="text-sm leading-normal text-gray-700">
                      Africa Suk operates centrally in Juba. Additional
                      distribution hubs and service offices may be added
                      as our operations expand.
                    </p>
                  </div>

                  {/* Online Availability */}
                  <div className="space-y-2 border border-gray-300 bg-gray-50 p-4">
                    <h3 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-gray-900">
                      <Clock className="h-4 w-4 text-[#004d26]" />
                      Online Availability
                    </h3>

                    <p className="text-base font-bold text-[#004d26]">
                      Open Online – 24/7
                    </p>

                    <p className="text-sm leading-normal text-gray-700">
                      Browse our store and place orders anytime,
                      including weekends and public holidays.
                    </p>

                    <p className="text-xs leading-normal text-gray-600">
                      Customer support responses are handled by our team.
                    </p>
                  </div>
                </div>
              </section>

              {/* Before Contacting Us */}
              <section className="space-y-4">
                <h2 className="flex items-center gap-2.5 border-b border-gray-300 pb-2.5 text-2xl font-bold text-gray-900">
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-[#004d26]" />
                  Before Contacting Us
                </h2>

                <p>
                  To help us resolve your request promptly, please include
                  the following details in your message:
                </p>

                <ul className="space-y-2.5 pl-1 text-base text-gray-800">
                  <li className="flex items-center gap-3">
                    <UserCheck className="h-5 w-5 shrink-0 text-[#004d26]" />
                    Your full name
                  </li>

                  <li className="flex items-center gap-3">
                    <Mail className="h-5 w-5 shrink-0 text-[#004d26]" />
                    Your registered account email address
                  </li>

                  <li className="flex items-center gap-3">
                    <FileText className="h-5 w-5 shrink-0 text-[#004d26]" />
                    Your order number (if applicable)
                  </li>

                  <li className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 shrink-0 text-[#004d26]" />
                    A clear description of your issue or request
                  </li>

                  <li className="flex items-center gap-3">
                    <Camera className="h-5 w-5 shrink-0 text-[#004d26]" />
                    Relevant photographs, screenshots, or packaging labels
                  </li>
                </ul>
              </section>

              {/* Need a Product? */}
              <section className="space-y-4">
                <h2 className="flex items-center gap-2.5 border-b border-gray-300 pb-2.5 text-2xl font-bold text-gray-900">
                  <PackageSearch className="h-6 w-6 shrink-0 text-[#004d26]" />
                  Need a Product?
                </h2>

                <p>
                  Can&apos;t find the product you are looking for in our
                  store? Submit a product request and our sourcing team
                  will check availability through regional and
                  international suppliers.
                </p>

                <div className="pt-1">
                  <Link
                    href="/request-product"
                    className="inline-flex items-center gap-2 bg-[#004d26] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#00361a]"
                  >
                    Request a Product
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <p className="text-sm italic text-gray-600">
                  Note: Product requests do not guarantee availability.
                  If we can source the requested product, we will contact
                  you with pricing and delivery options before an order
                  is placed.
                </p>
              </section>

              {/* Response Time */}
              <section className="space-y-3 pt-2">
                <h2 className="flex items-center gap-2.5 border-b border-gray-300 pb-2.5 text-2xl font-bold text-gray-900">
                  <Sparkles className="h-6 w-6 shrink-0 text-[#004d26]" />
                  Response Time
                </h2>

                <p>
                  Our team handles customer inquiries and aims to respond
                  as promptly as possible. Response times may vary
                  depending on the volume and complexity of inquiries.
                </p>

                <div className="flex items-center gap-2.5 pt-2 text-base font-bold text-[#004d26]">
                  <ShieldCheck className="h-5 w-5 shrink-0" />
                  Thank you for choosing Africa Suk. Shop with Confidence.
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-6 space-y-4 border border-gray-300 bg-gray-50 p-6">
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

                <table className="mt-3 w-full text-left text-sm">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <th className="w-1/3 py-2.5 align-top font-bold text-gray-900">
                        Support
                      </th>
                      <td className="break-all py-2.5 align-top font-mono text-xs font-semibold text-gray-900">
                        <a href="mailto:customer@africasuk.com">
                          customer@africasuk.com
                        </a>
                      </td>
                    </tr>

                    <tr className="border-b border-gray-200">
                      <th className="py-2.5 align-top font-bold text-gray-900">
                        Business
                      </th>
                      <td className="break-all py-2.5 align-top font-mono text-xs font-semibold text-gray-900">
                        <a href="mailto:business@africasuk.com">
                          business@africasuk.com
                        </a>
                      </td>
                    </tr>

                    <tr className="border-b border-gray-200">
                      <th className="py-2.5 align-top font-bold text-gray-900">
                        WhatsApp
                      </th>
                      <td className="py-2.5 align-top font-semibold text-gray-900">
                        <a
                          href="https://wa.me/211982851779"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#004d26]"
                        >
                          +211 982 851 779
                        </a>
                      </td>
                    </tr>

                    <tr className="border-b border-gray-200">
                      <th className="py-2.5 align-top font-bold text-gray-900">
                        Phone
                      </th>
                      <td className="py-2.5 align-top font-semibold text-gray-900">
                        <a
                          href="tel:+211923866290"
                          className="hover:text-[#004d26]"
                        >
                          +211 923 866 290
                        </a>
                      </td>
                    </tr>

                    <tr className="border-b border-gray-200">
                      <th className="py-2.5 align-top font-bold text-gray-900">
                        Website
                      </th>
                      <td className="break-all py-2.5 align-top font-semibold text-gray-900">
                        <a
                          href="https://www.africasuk.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#004d26]"
                        >
                          africasuk.com
                        </a>
                      </td>
                    </tr>

                    <tr className="border-b border-gray-200">
                      <th className="py-2.5 align-top font-bold text-gray-900">
                        Availability
                      </th>
                      <td className="py-2.5 align-top font-semibold text-[#004d26]">
                        Online 24/7
                      </td>
                    </tr>

                    <tr className="border-b border-gray-200">
                      <th className="py-2.5 align-top font-bold text-gray-900">
                        Location
                      </th>
                      <td className="py-2.5 align-top font-semibold text-gray-900">
                        Juba, South Sudan 🇸🇸
                      </td>
                    </tr>

                    <tr>
                      <th className="py-2.5 align-top font-bold text-gray-900">
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
                  <p className="text-xs font-medium italic text-gray-700">
                    &ldquo;Shop with Confidence. Direct support for
                    customers across South Sudan.&rdquo;
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </Container>
    </div>
  );
}
