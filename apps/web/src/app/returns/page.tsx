import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Mail,
  Globe,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import Container from "@/components/layout/Container";

export default function RefundPage() {
  const sections = [
    { id: "section-1", title: "1. When You May Request a Return/Refund" },
    { id: "section-2", title: "2. Contact Us as Soon as Possible" },
    { id: "section-3", title: "3. Return Period (7 Days)" },
    { id: "section-4", title: "4. Non-Returnable Products" },
    { id: "section-5", title: "5. Product Condition for Returns" },
    { id: "section-6", title: "6. Damaged Products" },
    { id: "section-7", title: "7. Wrong Product" },
    { id: "section-8", title: "8. Defective Products" },
    { id: "section-9", title: "9. Change-of-Mind Returns" },
    { id: "section-10", title: "10. Refund Eligibility" },
    { id: "section-11", title: "11. Refund Method" },
    { id: "section-12", title: "12. Delivery Fees & Return Costs" },
    { id: "section-13", title: "13. Order Cancellation Before Delivery" },
    { id: "section-14", title: "14. Orders That Cannot Be Delivered" },
    { id: "section-15", title: "15. Product Exchanges" },
    { id: "section-16", title: "16. Refunds for Unavailable Products" },
    { id: "section-17", title: "17. Product Requests" },
    { id: "section-18", title: "18. How to Request a Return or Refund" },
    { id: "section-19", title: "19. Return Inspection" },
    { id: "section-20", title: "20. Fraudulent or Abusive Returns" },
    { id: "section-21", title: "21. Manufacturer Warranty" },
    { id: "section-22", title: "22. Imported Products" },
    { id: "section-23", title: "23. Legal Consumer Rights" },
    { id: "section-24", title: "24. Policy Changes" },
    { id: "section-25", title: "25. Contact Africa Suk" },
  ];

  const nonReturnableItems = [
    "Food and consumable products",
    "Personal-care or hygiene products once opened",
    "Fragrances or beauty products once opened or used",
    "Certain baby-care products",
    "Products that have been used, damaged, altered, or improperly handled",
    "Personalized or specially prepared products",
    "Products where return restrictions are clearly stated before purchase",
    "Other products restricted by applicable law or safety requirements",
  ];

  return (
    <div className="py-10 sm:py-16 bg-white text-gray-900">
      <Container>
        <div className="mx-auto max-w-5xl">
          
          {/* Header */}
          <div className="mb-10 border-b border-gray-300 pb-8">
            <div className="flex items-center justify-start">
              <Link
                href="/"
                className="inline-flex items-center gap-2 border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-800 transition hover:border-gray-900 hover:bg-gray-100"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Website</span>
              </Link>
            </div>

            <div className="mt-6 text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#004d26] block">
                Customer Support &amp; Guarantees
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                Refund &amp; Returns Policy
              </h1>
              <p className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="h-4 w-4 text-[#004d26]" />
                <span>Last Updated: September 11, 2026</span>
              </p>
              <p className="mx-auto max-w-2xl text-base text-gray-800 leading-relaxed pt-1">
                At Africa Suk, we want customers to receive products that match their orders and are in acceptable condition. Return and refund requests are handled directly by Africa Suk.
              </p>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-12 items-start mt-6">
            
            {/* Main Content Column */}
            <div className="lg:col-span-8 space-y-10 leading-relaxed text-base text-gray-800">
              
              {/* Intro Banner */}
              <section className="space-y-4 bg-gray-50 border border-gray-200 p-5">
                <p className="font-medium text-gray-900 text-lg">
                  Shop with Confidence.
                </p>
                <p>
                  Africa Suk sells products directly to customers. All return and refund requests are managed directly by our team—never through independent third-party sellers.
                </p>
                <p className="font-bold text-[#004d26]">
                  Our goal is to make the return and refund process straightforward and fair.
                </p>
              </section>

              {/* 1. When You May Request a Return or Refund */}
              <section id="section-1" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  1. When You May Request a Return or Refund
                </h2>
                <p>You may contact Africa Suk if you receive a product that is:</p>
                <ul className="space-y-2 pl-2">
                  {[
                    "Damaged upon delivery",
                    "Defective or non-functional",
                    "Significantly different from the product ordered",
                    "The wrong product",
                    "Missing important parts or accessories",
                    "Otherwise not in the condition reasonably expected from the description",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="pt-1 text-sm text-gray-700">
                  A return or refund may also be available where required by applicable consumer law.
                </p>
              </section>

              {/* 2. Contact Us as Soon as Possible */}
              <section id="section-2" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  2. Contact Us as Soon as Possible
                </h2>
                <p>
                  If there is a problem with your order, contact Africa Suk as soon as possible after receiving the item. Please provide:
                </p>
                <ul className="space-y-2 pl-2">
                  {[
                    "Order number",
                    "Customer name",
                    "Product name",
                    "Detailed description of the problem",
                    "Photos or videos clearly showing the issue",
                    "Photos of the packaging (where relevant)",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="pt-1">
                  This helps us investigate the issue promptly and determine the best resolution.
                </p>
              </section>

              {/* 3. Return Period */}
              <section id="section-3" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  3. Return Period
                </h2>
                <div className="border-l-4 border-[#004d26] pl-4 py-1 space-y-2">
                  <p className="font-bold text-gray-900 text-lg">
                    Standard 7-Day Window
                  </p>
                  <p>
                    Unless a different period is stated on the product page or required by law, customers should contact Africa Suk within <strong>7 days</strong> of delivery to request an eligible return.
                  </p>
                </div>
                <p className="text-sm text-gray-700 pt-1">
                  Certain products may have specific return conditions based on their nature, clearly stated during checkout or on the product description page.
                </p>
              </section>

              {/* 4. Products That May Not Be Returnable */}
              <section id="section-4" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  4. Products That May Not Be Returnable
                </h2>
                <p>
                  Due to health, safety, and hygiene regulations, certain items cannot be returned once delivered:
                </p>
                <ul className="space-y-2 pl-2">
                  {nonReturnableItems.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-600 italic pt-1">
                  This does not limit any mandatory consumer rights that cannot legally be excluded under South Sudanese law.
                </p>
              </section>

              {/* 5. Product Condition for Returns */}
              <section id="section-5" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  5. Product Condition for Returns
                </h2>
                <p>Where a return is approved, items should generally be:</p>
                <ul className="space-y-2 pl-2">
                  {[
                    "Unused and in original condition",
                    "Returned with original packaging intact where reasonably possible",
                    "Returned with all included accessories",
                    "Returned with manuals and documentation",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="pt-1">
                  A product may be rejected for return if it has been damaged, altered, or significantly used after delivery, except where the defect was present upon arrival.
                </p>
              </section>

              {/* 6. Damaged Products */}
              <section id="section-6" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  6. Damaged Products
                </h2>
                <p>
                  If an item arrives damaged, notify us immediately with photos/videos showing the product, packaging, delivery labels, and damage. Depending on the scenario, Africa Suk may offer:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                  {["A direct replacement", "A repair (where appropriate)", "A complete refund", "Another reasonable resolution"].map((opt) => (
                    <div key={opt} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 7. Wrong Product */}
              <section id="section-7" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  7. Wrong Product
                </h2>
                <p>
                  If you receive an item different from what you ordered, contact us. After verification, we will arrange for the incorrect product to be returned and provide:
                </p>
                <ul className="space-y-2 pl-2">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                    <span>The correct product, where available; or</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                    <span>A full refund if a replacement cannot reasonably be provided.</span>
                  </li>
                </ul>
              </section>

              {/* 8. Defective Products */}
              <section id="section-8" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  8. Defective Products
                </h2>
                <p>
                  If a product does not function as reasonably expected due to a manufacturing defect, contact Africa Suk. Resolutions may include replacement, repair, or a refund. Specific manufacturer warranties may also apply where explicitly documented.
                </p>
              </section>

              {/* 9. Change-of-Mind Returns */}
              <section id="section-9" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  9. Change-of-Mind Returns
                </h2>
                <p>
                  Change-of-mind returns are not automatically guaranteed. Whether they are accepted depends on category, condition, packaging, return shipping costs, and whether the item was unsealed. Specific return conditions will be communicated if available for that item.
                </p>
              </section>

              {/* 10. Refund Eligibility */}
              <section id="section-10" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  10. Refund Eligibility
                </h2>
                <p>A refund may be issued when:</p>
                <ul className="space-y-2 pl-2">
                  {[
                    "Africa Suk cancels an order after payment has been received.",
                    "A product is out of stock and cannot reasonably be replaced.",
                    "An eligible return is inspected and approved.",
                    "A product is confirmed damaged or defective upon arrival.",
                    "A refund is required under South Sudanese consumer protection laws.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 11. Refund Method */}
              <section id="section-11" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  11. Refund Method
                </h2>
                <p>
                  Where possible, refunds are processed back to the original payment method. For <strong>Cash on Delivery</strong> orders, Africa Suk will coordinate an appropriate payout method (such as mobile money or bank transfer) after confirming your customer details.
                </p>
                <p className="text-sm text-gray-700">
                  Processing times may depend on your banking or mobile-money provider.
                </p>
              </section>

              {/* 12. Delivery Fees and Return Costs */}
              <section id="section-12" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  12. Delivery Fees and Return Costs
                </h2>
                <p>
                  If an item was delivered in error, damaged, or defective, Africa Suk covers the return shipping and delivery fees. For optional or approved change-of-mind returns, the customer may be responsible for return logistics costs.
                </p>
              </section>

              {/* 13. Order Cancellation Before Delivery */}
              <section id="section-13" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  13. Order Cancellation Before Delivery
                </h2>
                <p>
                  You may request cancellation before an order has been dispatched or entered final fulfillment. If accepted after payment has been received, refunds will be issued in accordance with this policy.
                </p>
              </section>

              {/* 14. Orders That Cannot Be Delivered */}
              <section id="section-14" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  14. Orders That Cannot Be Delivered
                </h2>
                <p>
                  Deliveries may fail due to incorrect phone numbers, invalid addresses, customer unavailability, or security restrictions. In cases where delivery fails due to customer-provided information, additional delivery arrangements or redelivery fees may apply.
                </p>
              </section>

              {/* 15. Product Exchanges */}
              <section id="section-15" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  15. Product Exchanges
                </h2>
                <p>
                  Where practical, an exchange may be offered instead of a refund. If the replacement product has a different price, the difference will be confirmed before completing the exchange.
                </p>
              </section>

              {/* 16. Refunds for Unavailable Products */}
              <section id="section-16" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  16. Refunds for Unavailable Products
                </h2>
                <p>
                  If an item becomes unavailable after order confirmation, we will contact you to offer a suitable alternative, remove the item, or issue an immediate refund.
                </p>
              </section>

              {/* 17. Product Requests */}
              <section id="section-17" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  17. Product Requests
                </h2>
                <p>
                  Custom items sourced on customer request are subject to standard return principles for defect/damage, but special return restrictions may apply depending on international supplier policies. These will be communicated prior to final order confirmation.
                </p>
              </section>

              {/* 18. How to Request a Return or Refund */}
              <section id="section-18" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  18. How to Request a Return or Refund
                </h2>
                <p>Contact Africa Suk through our official support channel:</p>
                <div className="border border-gray-300 p-5 bg-gray-50 space-y-2 text-sm">
                  <p className="font-extrabold text-base text-gray-900">Return Support Form</p>
                  <p className="text-gray-800">Email: <strong>support@africasuk.com</strong></p>
                  <div className="pt-2 font-mono text-xs text-gray-800 space-y-1 bg-white p-3 border border-gray-200">
                    <p>Order Number: [Your Order Number]</p>
                    <p>Product: [Product Name / SKU]</p>
                    <p>Reason for Return/Refund: [Explain issue]</p>
                    <p>Photos/Videos: [Attach clear evidence]</p>
                  </div>
                </div>
              </section>

              {/* 19. Return Inspection */}
              <section id="section-19" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  19. Return Inspection
                </h2>
                <p>
                  Africa Suk inspects all returned merchandise to verify condition, matching serial numbers, packaging, and the reported fault before approving a refund or replacement.
                </p>
              </section>

              {/* 20. Fraudulent or Abusive Returns */}
              <section id="section-20" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  20. Fraudulent or Abusive Returns
                </h2>
                <p>
                  Africa Suk reserves the right to decline returns or suspend accounts where there is clear evidence of fraud, product swapping, intentional damage, or repeated abusive claims.
                </p>
              </section>

              {/* 21. Manufacturer Warranty */}
              <section id="section-21" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  21. Manufacturer Warranty
                </h2>
                <p>
                  Certain products carry direct manufacturer warranties. Africa Suk provides documentation where applicable, and manufacturer warranties operate in addition to consumer rights under local law.
                </p>
              </section>

              {/* 22. Imported Products */}
              <section id="section-22" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  22. Imported Products
                </h2>
                <p>
                  Products imported from regional or global markets retain customer rights. However, availability of replacement parts or localized servicing may depend on the global manufacturer.
                </p>
              </section>

              {/* 23. Legal Consumer Rights */}
              <section id="section-23" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  23. Legal Consumer Rights
                </h2>
                <p>
                  Nothing in this policy excludes or limits any consumer protection that cannot be legally excluded under South Sudanese law, including the Consumer Protection Act, 2011.
                </p>
              </section>

              {/* 24. Policy Changes */}
              <section id="section-24" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  24. Policy Changes
                </h2>
                <p>
                  We may periodically revise this policy. Updates become effective upon posting the revised date at the top of this page.
                </p>
              </section>

              {/* 25. Contact Africa Suk */}
              <section id="section-25" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  25. Contact Africa Suk
                </h2>
                <div className="border border-gray-300 p-5 bg-gray-50 space-y-2">
                  <p className="font-extrabold text-gray-900">Africa Suk Support</p>
                  <p className="flex items-center gap-2 text-gray-800">
                    <Mail className="h-4 w-4 text-[#004d26]" />
                    <span>Email: <strong>support@africasuk.com</strong></span>
                  </p>
                  <p className="flex items-center gap-2 text-gray-800">
                    <Globe className="h-4 w-4 text-[#004d26]" />
                    <span>Website: <strong>www.africasuk.com</strong></span>
                  </p>
                </div>
              </section>

            </div>

            {/* Sidebar: Wikipedia-Style Infobox & Table of Contents */}
            <aside className="lg:col-span-4 space-y-6">
              
              {/* Infobox */}
              <div className="bg-gray-50 p-6 border border-gray-300">
                <div className="text-center pb-4 border-b border-gray-300">
                  <div className="flex justify-center mb-3">
                    <Image
                      src="/icon.png"
                      alt="Africa Suk Logo"
                      width={60}
                      height={60}
                      className="object-contain"
                      priority
                    />
                  </div>
                  <h3 className="font-extrabold text-lg text-gray-900">Africa Suk</h3>
                  <p className="text-xs font-semibold text-gray-700">Returns &amp; Refund Overview</p>
                </div>

                <table className="w-full text-left text-sm mt-3">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <th className="py-2.5 font-bold text-gray-900 w-1/3 align-top">Return Window</th>
                      <td className="py-2.5 text-gray-900 font-semibold align-top">7 Days from delivery</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="py-2.5 font-bold text-gray-900 align-top">Handled By</th>
                      <td className="py-2.5 text-gray-800 font-medium align-top">Africa Suk Directly</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="py-2.5 font-bold text-gray-900 align-top">Defect Costs</th>
                      <td className="py-2.5 text-emerald-800 font-bold align-top">Covered by Africa Suk</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="py-2.5 font-bold text-gray-900 align-top">Payout</th>
                      <td className="py-2.5 text-gray-800 font-medium align-top">Original method / Mobile Money</td>
                    </tr>
                    <tr>
                      <th className="py-2.5 font-bold text-gray-900 align-top">Claims</th>
                      <td className="py-2.5 text-gray-800 font-mono text-xs align-top">support@africasuk.com</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Table of Contents */}
              <div className="bg-white p-5 border border-gray-300 sticky top-6">
                <h3 className="font-bold text-base text-gray-900 border-b border-gray-300 pb-2 mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#004d26]" />
                  <span>Returns Policy Index</span>
                </h3>
                <nav className="max-h-[55vh] overflow-y-auto pr-1 space-y-1 text-xs">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block py-1 text-gray-700 hover:text-[#004d26] hover:font-bold transition-colors"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>

            </aside>

          </div>

        </div>
      </Container>
    </div>
  );
}