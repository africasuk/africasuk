import Link from "next/link";
import {
  Ban,
  CheckCircle2,
  XCircle,
  AlertCircle,
  SearchCheck,
  CreditCard,
  MapPin,
  RefreshCw,
  Mail,
  ShieldCheck,
  FileText,
} from "lucide-react";

import Container from "@/components/layout/Container";
import RefundHero from "@/components/returns/RefundHero";

export default function RefundPolicyPage() {
  return (
    <>
      <div className="py-10 sm:py-16 bg-white">
        <Container>
          <div className="mx-auto max-w-5xl">
            
            {/* Header */}
            <RefundHero />

            <div className="grid gap-12 lg:grid-cols-12">
              
              {/* Main Article Column */}
              <div className="lg:col-span-8 space-y-10 text-gray-800 leading-relaxed text-sm sm:text-base">
                
                {/* 1. Order Cancellation */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <Ban className="h-5 w-5 text-[#004d26]" />
                    <span>1. Order Cancellation</span>
                  </h2>
                  <p className="text-gray-600">
                    Orders may be cancelled before they have been confirmed with our supplier or entered processing.
                  </p>
                  <p className="text-xs text-gray-500 italic">
                    Once an order has been processed or shipped, it may no longer be eligible for cancellation.
                  </p>
                </section>

                {/* 2. Refund Eligibility */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-[#004d26]" />
                    <span>2. Refund Eligibility</span>
                  </h2>
                  <p className="text-gray-600">You may be eligible for a refund if:</p>
                  <ul className="space-y-2 text-gray-700 pl-1">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>You received the wrong product.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>The product arrives significantly damaged.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>The product is defective upon delivery.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Your order cannot be fulfilled by our supplier.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Your payment was successfully completed but your order could not be processed.</span>
                    </li>
                  </ul>
                </section>

                {/* 3. Non-Refundable Situations */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span>3. Non-Refundable Situations</span>
                  </h2>
                  <p className="text-gray-600">Refunds may not be available if:</p>
                  <ul className="space-y-2 text-gray-700 pl-1">
                    <li className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>You ordered the wrong item.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>You changed your mind after the order was processed.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>The product matches the description provided on our website.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>The issue results from misuse, accidental damage, or improper handling after delivery.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>The product is marked as non-returnable.</span>
                    </li>
                  </ul>
                </section>

                {/* 4. Reporting an Issue */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <AlertCircle className="h-5 w-5 text-[#004d26]" />
                    <span>4. Reporting an Issue</span>
                  </h2>
                  <p className="text-gray-600">
                    If you believe your order qualifies for a refund, please contact us as soon as possible after receiving your order.
                  </p>
                  <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider pt-1">
                    When contacting us, please include:
                  </p>
                  <ul className="space-y-2 text-gray-700 pl-1 text-xs sm:text-sm">
                    <li className="flex items-center gap-2.5">
                      <FileText className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Your order number</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Mail className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Your registered email address</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <AlertCircle className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>A description of the issue</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>Clear photos or videos showing the problem (if applicable)</span>
                    </li>
                  </ul>
                  <p className="text-xs text-gray-500 italic pt-1">
                    This helps us review your request more efficiently.
                  </p>
                </section>

                {/* 5. Refund Review */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <SearchCheck className="h-5 w-5 text-[#004d26]" />
                    <span>5. Refund Review</span>
                  </h2>
                  <p className="text-gray-600">
                    Each refund request is reviewed individually. AfricaSuk may request additional information before making a decision. Approval or rejection depends on the nature of the issue and, where applicable, the policies of our suppliers.
                  </p>
                </section>

                {/* 6. Approved Refunds */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <CreditCard className="h-5 w-5 text-[#004d26]" />
                    <span>6. Approved Refunds</span>
                  </h2>
                  <p className="text-gray-600">
                    If your refund is approved, it will be processed using the original payment method whenever possible. Processing times may vary depending on your payment provider.
                  </p>
                </section>

                {/* 7. Service Availability */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <MapPin className="h-5 w-5 text-[#004d26]" />
                    <span>7. Service Availability</span>
                  </h2>
                  <p className="text-gray-600">
                    At this time, AfricaSuk accepts orders only within <strong className="text-gray-900">Juba, South Sudan</strong>.
                  </p>
                  <p className="text-gray-600">
                    Customers located outside Juba may submit a{" "}
                    <Link href="/request-product" className="font-semibold text-[#004d26] underline underline-offset-2 hover:text-[#00361a]">
                      Product Request
                    </Link>. Availability, pricing, and delivery options will be reviewed before an order can be placed.
                  </p>
                </section>

                {/* 8. Changes to This Policy */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <RefreshCw className="h-5 w-5 text-[#004d26]" />
                    <span>8. Changes to This Policy</span>
                  </h2>
                  <p className="text-gray-600">
                    AfricaSuk may update this Refund Policy from time to time. Any changes will be published on this page.
                  </p>
                </section>

                {/* 9. Contact Us */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                    <Mail className="h-5 w-5 text-[#004d26]" />
                    <span>9. Contact Us</span>
                  </h2>
                  <p className="text-gray-600">
                    If you have questions about refunds or returns, please contact our support team at:
                  </p>
                  <p className="font-mono text-sm text-gray-900 font-semibold">
                    customer@africasuk.com
                  </p>
                </section>

              </div>

              {/* Sidebar: Wikipedia Infobox */}
              <aside className="lg:col-span-4">
                <div className="bg-gray-50/80 p-5 text-xs space-y-4 rounded-lg sticky top-6 border border-gray-200/60">
                  
                  <div className="text-center pb-3 border-b border-gray-200">
                    <div className="flex justify-center mb-2">
                      <ShieldCheck className="h-8 w-8 text-[#004d26]" />
                    </div>
                    <h3 className="font-bold text-sm text-gray-900">Refund Guidelines</h3>
                    <p className="text-gray-500 text-[11px]">AfricaSuk Customer Care</p>
                  </div>

                  <table className="w-full text-left">
                    <tbody>
                      <tr className="border-b border-gray-200/80">
                        <th className="py-2 font-semibold text-gray-600 w-1/3">Updated</th>
                        <td className="py-2 text-gray-900 font-medium">August 2026</td>
                      </tr>
                      <tr className="border-b border-gray-200/80">
                        <th className="py-2 font-semibold text-gray-600">Scope</th>
                        <td className="py-2 text-gray-900">Defective / Damaged / Wrong Items</td>
                      </tr>
                      <tr className="border-b border-gray-200/80">
                        <th className="py-2 font-semibold text-gray-600">Region</th>
                        <td className="py-2 text-gray-900">Juba, South Sudan 🇸🇸</td>
                      </tr>
                      <tr>
                        <th className="py-2 font-semibold text-gray-600">Claims</th>
                        <td className="py-2 text-gray-900 font-mono">customer@africasuk.com</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="pt-2 border-t border-gray-200 text-center">
                    <p className="italic text-[11px] text-gray-500">
                      &ldquo;Fair policies designed to protect both our local buyers and global suppliers.&rdquo;
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