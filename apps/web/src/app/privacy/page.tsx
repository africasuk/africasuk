import {
  Database,
  Sliders,
  Share2,
  ShieldCheck,
  Cookie,
  UserCheck,
  Baby,
  ExternalLink,
  RefreshCw,
  Mail,
  Lock,
  CheckCircle2,
  FileText,
} from "lucide-react";

import Container from "@/components/layout/Container";
import PrivacyHero from "@/components/privacy/PrivacyHero";

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="py-10 sm:py-16 bg-white">
        <Container>
          <div className="mx-auto max-w-5xl">
            
            {/* Header */}
            <PrivacyHero />

            <div className="grid gap-12 lg:grid-cols-12">
              
              {/* Main Article Column */}
              <div className="lg:col-span-8 space-y-10 text-gray-800 leading-relaxed text-sm sm:text-base">
                
                {/* 1. Information We Collect */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <Database className="h-5 w-5 text-[#004d26]" />
                    <span>1. Information We Collect</span>
                  </h2>
                  <p className="text-gray-600">
                    We may collect the following types of information when you interact with AfricaSuk:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    <div className="space-y-2">
                      <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-[#004d26]" /> Personal
                      </h3>
                      <ul className="space-y-1 text-xs text-gray-600">
                        <li>• Full name</li>
                        <li>• Email address</li>
                        <li>• Phone number</li>
                        <li>• Delivery address</li>
                        <li>• Billing information</li>
                        <li>• Account details</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-[#004d26]" /> Order Data
                      </h3>
                      <ul className="space-y-1 text-xs text-gray-600">
                        <li>• Products ordered</li>
                        <li>• Order history</li>
                        <li>• Payment status</li>
                        <li>• Product requests</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                        <Sliders className="h-4 w-4 text-[#004d26]" /> Technical
                      </h3>
                      <ul className="space-y-1 text-xs text-gray-600">
                        <li>• IP address</li>
                        <li>• Browser type</li>
                        <li>• Device &amp; OS</li>
                        <li>• Pages visited</li>
                        <li>• Cookies &amp; telemetry</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* 2. How We Use Your Information */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <Sliders className="h-5 w-5 text-[#004d26]" />
                    <span>2. How We Use Your Information</span>
                  </h2>
                  <p className="text-gray-600">We use your information to:</p>
                  <ul className="space-y-2 text-gray-700 pl-1 text-xs sm:text-sm">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Process and manage orders.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Deliver products and services.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Respond to customer support requests.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Manage product requests.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Improve our website and services.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Prevent fraud and unauthorized activity.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Comply with legal obligations.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Send important account or order updates.</span>
                    </li>
                  </ul>
                  <p className="text-xs text-gray-500 italic pt-1">
                    We will only send promotional communications where permitted by law or with your explicit consent.
                  </p>
                </section>

                {/* 3. Sharing Your Information */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <Share2 className="h-5 w-5 text-[#004d26]" />
                    <span>3. Sharing Your Information</span>
                  </h2>
                  <p className="font-semibold text-gray-900">
                    We do not sell your personal information.
                  </p>
                  <p className="text-gray-600">
                    We may share your information only when necessary with:
                  </p>
                  <ul className="space-y-2 text-gray-700 pl-1">
                    <li className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#004d26] shrink-0" />
                      <span>Payment providers</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#004d26] shrink-0" />
                      <span>Shipping and logistics partners</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#004d26] shrink-0" />
                      <span>Product suppliers</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#004d26] shrink-0" />
                      <span>Technology service providers</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#004d26] shrink-0" />
                      <span>Government authorities when required by law</span>
                    </li>
                  </ul>
                  <p className="text-xs text-gray-500 italic">
                    Each third party receives only the information necessary to perform its specific service.
                  </p>
                </section>

                {/* 4. Data Security */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <ShieldCheck className="h-5 w-5 text-[#004d26]" />
                    <span>4. Data Security</span>
                  </h2>
                  <p className="text-gray-600">
                    We use reasonable administrative, technical, and organizational measures to protect your personal information against unauthorized access, loss, misuse, or disclosure.
                  </p>
                  <p className="text-xs text-gray-500 italic">
                    However, no internet transmission or electronic storage system can be guaranteed to be 100% secure.
                  </p>
                </section>

                {/* 5. Cookies */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <Cookie className="h-5 w-5 text-[#004d26]" />
                    <span>5. Cookies</span>
                  </h2>
                  <p className="text-gray-600">
                    AfricaSuk may use cookies and similar tracking technologies to keep you signed in, remember your preferences, improve website performance, and understand how visitors use our platform.
                  </p>
                  <p className="text-xs text-gray-500">
                    You can manage or disable cookies through your browser settings, although some features of the website may not function properly as a result.
                  </p>
                </section>

                {/* 6. Your Rights */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <UserCheck className="h-5 w-5 text-[#004d26]" />
                    <span>6. Your Rights</span>
                  </h2>
                  <p className="text-gray-600">
                    Depending on applicable laws, you may have the right to:
                  </p>
                  <ul className="space-y-2 text-gray-700 pl-1 text-xs sm:text-sm">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Access your personal information.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Correct inaccurate information.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Request deletion of your account or personal data.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Request a copy of your personal information.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Withdraw consent where applicable.</span>
                    </li>
                  </ul>
                  <p className="text-xs text-gray-600 pt-1">
                    To exercise any of these rights, please contact our privacy desk.
                  </p>
                </section>

                {/* 7. Children's Privacy */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <Baby className="h-5 w-5 text-[#004d26]" />
                    <span>7. Children&apos;s Privacy</span>
                  </h2>
                  <p className="text-gray-600">
                    AfricaSuk is not intended for children under the age of 18 without the involvement of a parent or legal guardian. We do not knowingly collect personal information from children without appropriate authorization.
                  </p>
                </section>

                {/* 8. Third-Party Services */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <ExternalLink className="h-5 w-5 text-[#004d26]" />
                    <span>8. Third-Party Services</span>
                  </h2>
                  <p className="text-gray-600">
                    Our website may contain links to third-party websites or use third-party services such as payment processors and shipping providers. We are not responsible for the privacy practices or policies of those third parties.
                  </p>
                </section>

                {/* 9. Changes to This Privacy Policy */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <RefreshCw className="h-5 w-5 text-[#004d26]" />
                    <span>9. Changes to This Privacy Policy</span>
                  </h2>
                  <p className="text-gray-600">
                    We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. Continued use of AfricaSuk after changes become effective constitutes acceptance of the updated policy.
                  </p>
                </section>

                {/* 10. Contact Us */}
                <section className="space-y-3 pt-2">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <Mail className="h-5 w-5 text-[#004d26]" />
                    <span>10. Contact Us</span>
                  </h2>
                  <p className="text-gray-600">
                    If you have questions about this Privacy Policy or how your personal information is handled, please contact our support team at:
                  </p>
                  <p className="font-mono text-sm text-gray-900 font-semibold">
                    customer@africasuk.com
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
                      <Lock className="h-8 w-8 text-[#004d26]" />
                    </div>
                    <h3 className="font-bold text-sm text-gray-900">Privacy Summary</h3>
                    <p className="text-gray-500 text-[11px]">AfricaSuk Protection</p>
                  </div>

                  <table className="w-full text-left">
                    <tbody>
                      <tr className="border-b border-gray-200/80">
                        <th className="py-2 font-semibold text-gray-600 w-1/3">Updated</th>
                        <td className="py-2 text-gray-900 font-medium">August 2026</td>
                      </tr>
                      <tr className="border-b border-gray-200/80">
                        <th className="py-2 font-semibold text-gray-600">Data Sale</th>
                        <td className="py-2 text-[#004d26] font-bold">Never Sold</td>
                      </tr>
                      <tr className="border-b border-gray-200/80">
                        <th className="py-2 font-semibold text-gray-600">Cookies</th>
                        <td className="py-2 text-gray-900">Functional &amp; Analytics</td>
                      </tr>
                      <tr>
                        <th className="py-2 font-semibold text-gray-600">Privacy Inquiry</th>
                        <td className="py-2 text-gray-900 font-mono">customer@africasuk.com</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="pt-2 border-t border-gray-200 text-center">
                    <p className="italic text-[11px] text-gray-500">
                      &ldquo;Committed to protecting your personal information and maintaining full transparency.&rdquo;
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