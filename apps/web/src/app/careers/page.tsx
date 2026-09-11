import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Building2,
  Clock,
  HeartHandshake,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import Container from "@/components/layout/Container";
import CareersHero from "@/components/careers/CareersHero";

export default function CareersPage() {
  return (
    <>
      <div className="bg-white py-10 sm:py-16 text-gray-900">
        <Container>
          <div className="mx-auto max-w-5xl">
            {/* Header */}
            <CareersHero />

            <div className="grid gap-12 lg:grid-cols-12 items-start mt-6">
              {/* Main Column */}
              <div className="space-y-10 text-base leading-relaxed text-gray-800 lg:col-span-8">
                
                {/* Introduction */}
                <section className="space-y-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-[#004d26] block">
                    Join Our Mission
                  </span>

                  <p className="text-lg text-gray-900 font-medium leading-relaxed">
                    At <strong className="font-extrabold text-black">Africa Suk</strong>, we believe that building a great company starts with great people.
                  </p>

                  <p className="text-base text-gray-800 leading-relaxed">
                    As Africa Suk grows, we plan to create opportunities for talented and motivated people across South Sudan. We want to build a team focused on technology, customer experience, operations, logistics, and the future of online shopping.
                  </p>
                </section>

                <hr className="border-gray-300" />

                {/* Application Status */}
                <section className="space-y-4">
                  <h2 className="flex items-center gap-2.5 border-b border-gray-300 pb-2.5 text-2xl font-bold text-gray-900">
                    <Clock className="h-6 w-6 text-[#004d26] shrink-0" />
                    <span>Application Status</span>
                  </h2>

                  <div className="border border-amber-300 bg-amber-50/60 p-4">
                    <p className="font-bold text-base text-amber-900">
                      We are not accepting job applications at this time.
                    </p>
                    <p className="text-sm text-amber-800 pt-1">
                      As new positions become available, we will publish them here and through our official communication channels.
                    </p>
                  </div>
                </section>

                {/* Future Career Areas */}
                <section className="space-y-4">
                  <h2 className="flex items-center gap-2.5 border-b border-gray-300 pb-2.5 text-2xl font-bold text-gray-900">
                    <Sparkles className="h-6 w-6 text-[#004d26] shrink-0" />
                    <span>Future Career Areas</span>
                  </h2>

                  <div className="grid grid-cols-1 gap-6 pt-2 sm:grid-cols-2">
                    <div className="border border-gray-300 p-4 bg-gray-50 space-y-1">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 shrink-0 text-[#004d26]" />
                        <span className="block text-base font-bold text-gray-900">
                          Customer Experience
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Customer support, order inquiries, conflict resolution, and client care.
                      </p>
                    </div>

                    <div className="border border-gray-300 p-4 bg-gray-50 space-y-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 shrink-0 text-[#004d26]" />
                        <span className="block text-base font-bold text-gray-900">
                          Logistics &amp; Operations
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Order processing, warehouse fulfillment, dispatch, and regional supply chain.
                      </p>
                    </div>

                    <div className="border border-gray-300 p-4 bg-gray-50 space-y-1">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 shrink-0 text-[#004d26]" />
                        <span className="block text-base font-bold text-gray-900">
                          Technology
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Software engineering, web &amp; mobile app platforms, security, and digital infrastructure.
                      </p>
                    </div>

                    <div className="border border-gray-300 p-4 bg-gray-50 space-y-1">
                      <div className="flex items-center gap-2">
                        <HeartHandshake className="h-5 w-5 shrink-0 text-[#004d26]" />
                        <span className="block text-base font-bold text-gray-900">
                          Business Operations
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Administration, supplier partnerships, business development, and market growth.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Growing Together */}
                <section className="space-y-4">
                  <h2 className="flex items-center gap-2.5 border-b border-gray-300 pb-2.5 text-2xl font-bold text-gray-900">
                    <HeartHandshake className="h-6 w-6 text-[#004d26] shrink-0" />
                    <span>Growing Together</span>
                  </h2>

                  <p className="text-base text-gray-800 leading-relaxed">
                    Africa Suk is still growing. Our future team will play an important role in making online shopping easier and more accessible in South Sudan.
                  </p>

                  <p className="text-base text-gray-800 leading-relaxed">
                    Thank you for your interest in building that future with us.
                  </p>
                </section>

                {/* Contact CTA */}
                <section className="border border-gray-300 bg-gray-50 p-6 space-y-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    Interested in Africa Suk?
                  </h3>

                  <p className="text-sm text-gray-700 leading-relaxed">
                    For general career inquiries or partnerships, you can contact our team. Please note that reaching out does not constitute an active job application.
                  </p>

                  <div className="pt-2">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 border border-gray-900 bg-[#004d26] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#00361a]"
                    >
                      <span>Contact Us</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </section>

              </div>

              {/* Sidebar: Clean Wikipedia-style Infobox */}
              <aside className="lg:col-span-4">
                <div className="border border-gray-300 bg-gray-50 p-6 space-y-4 sticky top-6">
                  
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
                      Employment &amp; Opportunities
                    </p>
                  </div>

                  <table className="w-full text-left text-sm mt-3">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <th className="w-1/3 py-2.5 font-bold text-gray-900 align-top">
                          Status
                        </th>
                        <td className="py-2.5 font-bold text-amber-800 align-top">
                          Applications Closed
                        </td>
                      </tr>

                      <tr className="border-b border-gray-200">
                        <th className="py-2.5 font-bold text-gray-900 align-top">
                          Location
                        </th>
                        <td className="py-2.5 font-semibold text-gray-900 align-top">
                          Juba, South Sudan 🇸🇸
                        </td>
                      </tr>

                      <tr className="border-b border-gray-200">
                        <th className="py-2.5 font-bold text-gray-900 align-top">
                          Focus
                        </th>
                        <td className="py-2.5 text-gray-800 font-medium align-top">
                          Technology, Logistics &amp; Operations
                        </td>
                      </tr>

                      <tr>
                        <th className="py-2.5 font-bold text-gray-900 align-top">
                          Inquiries
                        </th>
                        <td className="py-2.5 font-mono text-xs text-gray-900 font-semibold align-top">
                          customer@africasuk.com
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="border-t border-gray-300 pt-3 text-center">
                    <p className="text-xs italic font-medium text-gray-700">
                      &ldquo;Building opportunities as Africa Suk grows.&rdquo;
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