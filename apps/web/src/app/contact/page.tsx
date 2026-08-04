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
  ExternalLink,
  ShieldCheck,
  UserCheck,
  FileText,
  Camera,
} from "lucide-react";

import Container from "@/components/layout/Container";
import ContactHero from "@/components/contact/ContactHero";

export default function ContactPage() {
  return (
    <>
      <div className="py-10 sm:py-16 bg-white">
        <Container>
          <div className="mx-auto max-w-5xl">
            
            {/* Header */}
            <ContactHero />

            <div className="grid gap-12 lg:grid-cols-12">
              
              {/* Main Article Column */}
              <div className="lg:col-span-8 space-y-10 text-gray-800 leading-relaxed text-sm sm:text-base">
                
                {/* Customer Support */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <Mail className="h-5 w-5 text-[#004d26]" />
                    <span>Customer Support</span>
                  </h2>
                  <p className="text-gray-600">
                    For general inquiries, orders, product requests, and account assistance:
                  </p>
                  <p className="font-mono text-sm text-gray-900 font-bold flex items-center gap-2 pt-1">
                    <span className="text-[#004d26]">Email:</span>
                    <a href="mailto:customer@africasuk.com" className="underline underline-offset-2 hover:text-[#004d26]">
                      customer@africasuk.com
                    </a>
                  </p>
                </section>

                {/* Business & Partnerships */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <Building2 className="h-5 w-5 text-[#004d26]" />
                    <span>Business &amp; Partnerships</span>
                  </h2>
                  <p className="text-gray-600">
                    Interested in partnering with AfricaSuk, supplying products, or discussing business opportunities?
                  </p>
                  <p className="font-mono text-sm text-gray-900 font-bold flex items-center gap-2 pt-1">
                    <span className="text-[#004d26]">Email:</span>
                    <a href="mailto:business@africasuk.com" className="underline underline-offset-2 hover:text-[#004d26]">
                      business@africasuk.com
                    </a>
                  </p>
                </section>

                {/* Office Location & Hours */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <MapPin className="h-5 w-5 text-[#004d26]" />
                    <span>Office Location &amp; Hours</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-[#004d26]" /> Office Location
                      </h3>
                      <p className="text-gray-700 font-medium">Juba, South Sudan 🇸🇸</p>
                      <p className="text-xs text-gray-500 italic">
                        Our full office address will be published as our operations continue to expand.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-[#004d26]" /> Business Hours
                      </h3>
                      <p className="text-gray-700 text-xs sm:text-sm">
                        <strong className="text-gray-900">Monday – Saturday:</strong> 9:00 AM – 6:00 PM (EAT)
                      </p>
                      <p className="text-gray-700 text-xs sm:text-sm">
                        <strong className="text-gray-900">Sunday:</strong> Closed
                      </p>
                    </div>
                  </div>
                </section>

                {/* Before Contacting Us */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-[#004d26]" />
                    <span>Before Contacting Us</span>
                  </h2>
                  <p className="text-gray-600">
                    To help us assist you as quickly as possible, please include:
                  </p>
                  <ul className="space-y-2 text-gray-700 pl-1 text-xs sm:text-sm">
                    <li className="flex items-center gap-2.5">
                      <UserCheck className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Your full name</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Mail className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Your registered email address</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <FileText className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Your order number (if applicable)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <MessageSquare className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>A clear description of your inquiry</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Camera className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Photos or screenshots, if relevant</span>
                    </li>
                  </ul>
                </section>

                {/* Need a Product? */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <PackageSearch className="h-5 w-5 text-[#004d26]" />
                    <span>Need a Product?</span>
                  </h2>
                  <p className="text-gray-600">
                    Can&apos;t find the product you&apos;re looking for? Submit a product request through our custom sourcing portal:
                  </p>
                  <div className="pt-1">
                    <Link
                      href="/request-product"
                      className="inline-flex items-center gap-2 text-xs font-bold text-white bg-[#004d26] px-4 py-2.5 rounded-full hover:bg-[#00361a] transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Submit Product Request</span>
                    </Link>
                  </div>
                  <p className="text-xs text-gray-500 italic pt-1">
                    If we successfully source the product, we&apos;ll add it to our catalog and notify you so you can place your order through your AfricaSuk account.
                  </p>
                </section>

                {/* Response Time & Footer Slogan */}
                <section className="space-y-3 pt-2">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <Sparkles className="h-5 w-5 text-[#004d26]" />
                    <span>Response Time</span>
                  </h2>
                  <p className="text-gray-600">
                    We aim to respond to all inquiries as quickly as possible during our business hours. Response times may vary depending on the nature and volume of requests.
                  </p>
                  <p className="text-sm font-bold text-[#004d26] pt-2 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Thank you for choosing AfricaSuk. Shop with Confidence.</span>
                  </p>
                </section>

              </div>

              {/* Sidebar: Wikipedia Infobox */}
              <aside className="lg:col-span-4">
                <div className="bg-gray-50/80 p-5 text-xs space-y-4 rounded-lg sticky top-6 border border-gray-200/60">
                  
                  <div className="text-center pb-3 border-b border-gray-200">
                    <div className="flex justify-center mb-2">
                      <Mail className="h-8 w-8 text-[#004d26]" />
                    </div>
                    <h3 className="font-bold text-sm text-gray-900">Contact Summary</h3>
                    <p className="text-gray-500 text-[11px]">AfricaSuk Desk</p>
                  </div>

                  <table className="w-full text-left">
                    <tbody>
                      <tr className="border-b border-gray-200/80">
                        <th className="py-2 font-semibold text-gray-600 w-1/3">Support</th>
                        <td className="py-2 text-gray-900 font-mono text-[11px]">customer@africasuk.com</td>
                      </tr>
                      <tr className="border-b border-gray-200/80">
                        <th className="py-2 font-semibold text-gray-600">Business</th>
                        <td className="py-2 text-gray-900 font-mono text-[11px]">business@africasuk.com</td>
                      </tr>
                      <tr className="border-b border-gray-200/80">
                        <th className="py-2 font-semibold text-gray-600">Hours</th>
                        <td className="py-2 text-gray-900">Mon–Sat (9 AM–6 PM EAT)</td>
                      </tr>
                      <tr className="border-b border-gray-200/80">
                        <th className="py-2 font-semibold text-gray-600">Location</th>
                        <td className="py-2 text-gray-900">Juba, South Sudan 🇸🇸</td>
                      </tr>
                      <tr>
                        <th className="py-2 font-semibold text-gray-600">Requests</th>
                        <td className="py-2 text-[#004d26] font-semibold">africasuk.com/request-product</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="pt-2 border-t border-gray-200 text-center">
                    <p className="italic text-[11px] text-gray-500">
                      &ldquo;Shop with Confidence. Dedicated support for South Sudan.&rdquo;
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