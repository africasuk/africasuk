
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  CalendarDays,
  FileCheck,
  Landmark,
  MapPin,
  ArrowRight,
  HeartHandshake,
  BadgeCheck,
} from "lucide-react";

import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Business Information | Africa Suk",
  description:
    "Learn about Africa Suk's business registration and taxpayer registration in Juba, South Sudan.",
  alternates: {
    canonical: "https://africasuk.com/business-information",
  },
  openGraph: {
    title: "Business Information | Africa Suk",
    description:
      "Official business registration information for Africa Suk in South Sudan.",
    url: "https://africasuk.com/business-information",
    type: "website",
  },
};

const registrationDetails = [
  {
    label: "Business Name",
    value: "AFRICA SUK",
    icon: Building2,
  },
  {
    label: "Registration Number",
    value: "BNR1126-YJU7YQ",
    icon: FileCheck,
  },
  {
    label: "Registration Date",
    value: "10 November 2026",
    icon: CalendarDays,
  },
  {
    label: "Registration Authority",
    value: "Ministry of Justice and Constitutional Affairs",
    icon: Landmark,
  },
  {
    label: "Legal Framework",
    value: "Business Names Act, 2008",
    icon: ShieldCheck,
  },
  {
    label: "Registered Location",
    value: "Juba, Central Equatoria, South Sudan",
    icon: MapPin,
  },
];

export default function BusinessInformationPage() {
  return (
    <div className="bg-white py-10 text-gray-900 sm:py-16">
      <Container>
        <div className="mx-auto max-w-5xl">

          {/* Page Header */}
          <div className="mb-10 space-y-3">
            <span className="block text-sm font-bold uppercase tracking-wider text-[#004d26]">
              Transparency & Accountability
            </span>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
              Business Information
            </h1>

            <p className="max-w-3xl text-base leading-relaxed text-gray-700">
              Africa Suk is an online shopping marketplace serving
              customers in South Sudan. We believe transparency,
              accountability and customer confidence are essential
              to building a reliable shopping experience.
            </p>
          </div>

          {/* Main Content + Sidebar */}
          <div className="mt-6 grid items-start gap-12 lg:grid-cols-12">

            {/* Main Column */}
            <div className="space-y-10 text-base leading-relaxed text-gray-800 lg:col-span-8">

              {/* Introduction */}
              <section className="space-y-4">
                <span className="block text-sm font-bold uppercase tracking-wider text-[#004d26]">
                  Official Business Registration
                </span>

                <p className="text-lg font-medium leading-relaxed text-gray-900">
                  Africa Suk is registered as a business name
                  under the laws of the Republic of South Sudan.
                </p>

                <p>
                  The registration was issued by the Ministry of
                  Justice and Constitutional Affairs through the
                  Registrar of Companies, Business Names,
                  Partnerships and Intellectual Properties.
                </p>
              </section>

              <hr className="border-gray-300" />

              {/* Registration Details */}
              <section className="space-y-4">
                <h2 className="flex items-center gap-2.5 border-b border-gray-300 pb-2.5 text-2xl font-bold text-gray-900">
                  <FileCheck className="h-6 w-6 shrink-0 text-[#004d26]" />
                  Registration Details
                </h2>

                <div className="space-y-4">
                  {registrationDetails.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="flex items-start gap-3"
                      >
                        <Icon className="mt-1 h-5 w-5 shrink-0 text-[#004d26]" />

                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {item.label}
                          </p>

                          <p className="text-sm text-gray-700">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <hr className="border-gray-300" />

              {/* Tax Registration */}
              <section className="space-y-4">
                <h2 className="flex items-center gap-2.5 border-b border-gray-300 pb-2.5 text-2xl font-bold text-gray-900">
                  <Landmark className="h-6 w-6 shrink-0 text-[#004d26]" />
                  Tax Registration
                </h2>

                <p>
                  Africa Suk is registered as a taxpayer with the
                  South Sudan Revenue Authority (NRA).
                </p>

                <div className="border border-green-200 bg-green-50/50 p-4">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-[#004d26]" />

                    <span className="font-bold text-[#004d26]">
                      Taxpayer Registration Issued
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-700">
                    Tax Identification Number issued on
                    10 November 2026.
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Issuing authority: South Sudan Revenue Authority.
                  </p>
                </div>
              </section>

              <hr className="border-gray-300" />

              {/* Our Business */}
              <section className="space-y-4">
                <h2 className="flex items-center gap-2.5 border-b border-gray-300 pb-2.5 text-2xl font-bold text-gray-900">
                  <Building2 className="h-6 w-6 shrink-0 text-[#004d26]" />
                  About Our Business
                </h2>

                <p>
                  Africa Suk operates an online marketplace
                  designed to make shopping easier and more
                  accessible for customers in South Sudan.
                </p>

                <p>
                  Customers can explore products, place orders
                  through our website or mobile applications,
                  and access our customer support services.
                </p>

                <p>
                  Our operations focus on online retail,
                  product sourcing, order processing and
                  convenient delivery arrangements.
                </p>
              </section>

              <hr className="border-gray-300" />

              {/* Commitment */}
              <section className="space-y-4">
                <h2 className="flex items-center gap-2.5 border-b border-gray-300 pb-2.5 text-2xl font-bold text-gray-900">
                  <HeartHandshake className="h-6 w-6 shrink-0 text-[#004d26]" />
                  Our Commitment
                </h2>

                <p>
                  We are committed to operating transparently,
                  providing accessible customer support and
                  continuously improving the shopping experience
                  for our customers.
                </p>

                <p>
                  Our goal is to contribute to the growth of
                  digital commerce in South Sudan and build
                  long-term relationships with our customers.
                </p>
              </section>

              {/* Contact */}
              <section className="space-y-4 border border-gray-300 bg-gray-50 p-6">
                <h2 className="text-lg font-bold text-gray-900">
                  Need More Information?
                </h2>

                <p className="text-sm leading-relaxed text-gray-700">
                  For business inquiries, registration-related
                  questions or general assistance, contact our team.
                </p>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border border-gray-900 bg-[#004d26] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#00361a]"
                >
                  Contact Us
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-6 space-y-4 border border-gray-300 bg-gray-50 p-6">

                {/* Business Identity */}
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
                    Online Shopping Marketplace
                  </p>
                </div>

                {/* Business Infobox */}
                <table className="mt-3 w-full text-left text-sm">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <th className="w-1/3 py-2.5 align-top font-bold text-gray-900">
                        Status
                      </th>

                      <td className="py-2.5 font-bold text-[#004d26]">
                        Registered Business
                      </td>
                    </tr>

                    <tr className="border-b border-gray-200">
                      <th className="py-2.5 align-top font-bold text-gray-900">
                        Location
                      </th>

                      <td className="py-2.5 font-semibold text-gray-900">
                        Juba, South Sudan 🇸🇸
                      </td>
                    </tr>

                    <tr className="border-b border-gray-200">
                      <th className="py-2.5 align-top font-bold text-gray-900">
                        Industry
                      </th>

                      <td className="py-2.5 text-gray-800">
                        E-commerce & Online Retail
                      </td>
                    </tr>

                    <tr className="border-b border-gray-200">
                      <th className="py-2.5 align-top font-bold text-gray-900">
                        Registered
                      </th>

                      <td className="py-2.5 text-gray-800">
                        10 November 2026
                      </td>
                    </tr>

                    <tr>
                      <th className="py-2.5 align-top font-bold text-gray-900">
                        Website
                      </th>

                      <td className="break-all py-2.5 text-xs font-semibold text-gray-900">
                        africasuk.com
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Registration Note */}
                <div className="border-t border-gray-300 pt-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-[#004d26]" />

                    <span className="text-sm font-bold text-gray-900">
                      Business Transparency
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-gray-600">
                    Business registration and taxpayer
                    registration information is provided
                    for transparency.
                  </p>
                </div>

                <div className="border-t border-gray-300 pt-3 text-center">
                  <p className="text-xs font-medium italic text-gray-700">
                    &quot;Shop with Confidence.&quot;
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
