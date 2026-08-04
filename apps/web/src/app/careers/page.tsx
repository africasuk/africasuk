import {
  Users,
  Building2,
  Clock,
  HeartHandshake,

  MapPin,
  Sparkles,
} from "lucide-react";

import Container from "@/components/layout/Container";
import CareersHero from "@/components/careers/CareersHero";

export default function CareersPage() {
  return (
    <>
      <div className="py-10 sm:py-16 bg-white">
        <Container>
          <div className="mx-auto max-w-5xl">
            
            {/* Header */}
            <CareersHero />

            <div className="grid gap-12 lg:grid-cols-12">
              
              {/* Main Column */}
              <div className="lg:col-span-8 space-y-8 text-gray-800 leading-relaxed text-sm sm:text-base">
                
                {/* Intro Section */}
                <section className="space-y-4">
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                    At <strong className="text-gray-900 font-bold">AfricaSuk</strong>, we believe that empowering people is just as important as delivering products.
                  </p>
                  <p className="text-gray-600">
                    As our company continues to grow, we plan to create employment opportunities for talented and motivated young people across South Sudan. Our goal is to build a team that is passionate about innovation, customer service, technology, logistics, and international commerce.
                  </p>
                </section>

                <hr className="border-gray-200" />

                {/* Section: Status */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <Clock className="h-5 w-5 text-[#004d26]" />
                    <span>Application Status</span>
                  </h2>
                  <p className="text-gray-600">
                    We are not accepting job applications at this time, but we look forward to opening career opportunities in the future.
                  </p>
                  <p className="text-gray-600">
                    When positions become available, they will be announced here and through our official communication channels.
                  </p>
                </section>

                {/* Section: Future Areas */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <Sparkles className="h-5 w-5 text-[#004d26]" />
                    <span>Future Career Areas</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-gray-900 block text-sm">Customer Experience</span>
                        <span className="text-xs text-gray-500">Support, inquiries, and client success.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-gray-900 block text-sm">Logistics &amp; Operations</span>
                        <span className="text-xs text-gray-500">Order processing, fulfillment, and supply chain.</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section: Impact */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <HeartHandshake className="h-5 w-5 text-[#004d26]" />
                    <span>Growing Together</span>
                  </h2>
                  <p className="text-gray-600">
                    Thank you for your interest in AfricaSuk. We look forward to growing together and creating opportunities that make a positive impact in our communities.
                  </p>
                </section>

              </div>

              {/* Sidebar: Wikipedia Infobox */}
              <aside className="lg:col-span-4">
                <div className="bg-gray-50/80 p-5 text-xs space-y-4 rounded-lg sticky top-6 border border-gray-200/60">
                  
                  <div className="text-center pb-3 border-b border-gray-200">
                    <div className="flex justify-center mb-2">
                      <Building2 className="h-8 w-8 text-[#004d26]" />
                    </div>
                    <h3 className="font-bold text-sm text-gray-900">AfricaSuk Careers</h3>
                    <p className="text-gray-500 text-[11px]">Employment &amp; Opportunities</p>
                  </div>

                  <table className="w-full text-left">
                    <tbody>
                      <tr className="border-b border-gray-200/80">
                        <th className="py-2 font-semibold text-gray-600 w-1/3">Status</th>
                        <td className="py-2 text-amber-700 font-medium">Coming Soon</td>
                      </tr>
                      <tr className="border-b border-gray-200/80">
                        <th className="py-2 font-semibold text-gray-600">Location</th>
                        <td className="py-2 text-gray-900 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-500" />
                          <span>South Sudan 🇸🇸</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200/80">
                        <th className="py-2 font-semibold text-gray-600">Focus</th>
                        <td className="py-2 text-gray-900">Logistics, Tech &amp; Service</td>
                      </tr>
                      <tr>
                        <th className="py-2 font-semibold text-gray-600">Inquiries</th>
                        <td className="py-2 text-gray-900 font-mono">customer@africasuk.com</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="pt-2 border-t border-gray-200 text-center">
                    <p className="italic text-[11px] text-gray-500">
                      &ldquo;Empowering people and creating local opportunities across South Sudan.&rdquo;
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