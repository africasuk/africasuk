
import Link from "next/link";
import {
  ShoppingBag,
  PackageCheck,
  Truck,
  CreditCard,
  RotateCcw,
  MessageSquare,
  Mail,
  ListCheck,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  Clock,
  Phone,
} from "lucide-react";

import Container from "@/components/layout/Container";
import HelpHero from "@/components/help/HelpHero";

export default function HelpPage() {
  return (
    <div className="bg-white py-10 sm:py-16">
      <Container>
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <HelpHero />

          <div className="grid gap-12 lg:grid-cols-12">
            {/* Main Article Column */}
            <div className="space-y-10 text-sm leading-relaxed text-gray-800 sm:text-base lg:col-span-8">

              {/* Orders */}
              <section className="space-y-4">
                <h2 className="flex items-center gap-2.5 border-b border-gray-200 pb-2 text-xl font-bold text-gray-900">
                  <ShoppingBag className="h-5 w-5 text-[#004d26]" />
                  Orders
                </h2>

                <ul className="space-y-2.5 pl-1 text-gray-700">
                  {[
                    "Track your order status.",
                    "View your order history.",
                    "Cancel an order before processing begins.",
                    "Request assistance with your order.",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#004d26]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/account/orders"
                  className="inline-flex items-center gap-2 rounded-full bg-[#004d26] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#00361a]"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  My Orders
                </Link>
              </section>

              {/* Product Requests */}
              <section className="space-y-4">
                <h2 className="flex items-center gap-2.5 border-b border-gray-200 pb-2 text-xl font-bold text-gray-900">
                  <PackageCheck className="h-5 w-5 text-[#004d26]" />
                  Product Requests
                </h2>

                <p className="text-gray-600">
                  Can&apos;t find the product you&apos;re looking for?
                  Visit our Product Request page and tell us what you need.
                </p>

                <p className="text-gray-600">
                  Once we source and add your requested product to our
                  catalog, we&apos;ll notify you so you can place your
                  order through your account.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Link
                    href="/request-product"
                    className="inline-flex items-center gap-2 rounded-full bg-[#004d26] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#00361a]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Request Product
                  </Link>

                  <Link
                    href="/account/requests"
                    className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2.5 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-200"
                  >
                    <ListCheck className="h-3.5 w-3.5" />
                    My Product Requests
                  </Link>
                </div>
              </section>

              {/* Shipping & Delivery */}
              <section className="space-y-4">
                <h2 className="flex items-center gap-2.5 border-b border-gray-200 pb-2 text-xl font-bold text-gray-900">
                  <Truck className="h-5 w-5 text-[#004d26]" />
                  Shipping &amp; Delivery
                </h2>

                <p className="text-gray-600">
                  We source products from suppliers and arrange delivery
                  to customers in South Sudan. Delivery times may vary
                  depending on:
                </p>

                <ul className="grid grid-cols-1 gap-3 pl-1 text-gray-700 sm:grid-cols-2">
                  {[
                    "Product availability",
                    "Supplier processing time",
                    "International shipping",
                    "Customs clearance",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#004d26]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="pt-1 text-xs italic text-gray-500">
                  Estimated delivery times will be shared during the
                  ordering process whenever available.
                </p>

                <Link
                  href="/shipping"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#004d26] underline underline-offset-2 hover:text-[#00361a]"
                >
                  View Shipping &amp; Delivery Information
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </section>

              {/* Payments */}
              <section className="space-y-4">
                <h2 className="flex items-center gap-2.5 border-b border-gray-200 pb-2 text-xl font-bold text-gray-900">
                  <CreditCard className="h-5 w-5 text-[#004d26]" />
                  Payments
                </h2>

                <p className="text-gray-600">
                  Cash is currently available as a payment method.
                  Payment arrangements depend on your order value
                  and delivery location.
                </p>

                <p className="text-gray-600">
                  For eligible orders in Juba below 400,000 SSP,
                  Cash on Delivery is available. Larger orders and
                  selected locations outside Juba require advance
                  payment.
                </p>

                <p className="text-gray-600">
                  Bank transfer and mobile money payment options
                  are planned for the future and are not currently
                  available.
                </p>

                <Link
                  href="/payment-information"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#004d26] underline underline-offset-2 hover:text-[#00361a]"
                >
                  View Payment Information
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </section>

              {/* Returns & Refunds */}
              <section className="space-y-4">
                <h2 className="flex items-center gap-2.5 border-b border-gray-200 pb-2 text-xl font-bold text-gray-900">
                  <RotateCcw className="h-5 w-5 text-[#004d26]" />
                  Returns &amp; Refunds
                </h2>

                <p className="text-gray-600">
                  Return and refund eligibility depends on the product
                  type and applicable supplier policies.
                </p>

                <p className="text-gray-600">
                  For complete details, please review our{" "}
                  <Link
                    href="/returns"
                    className="font-semibold text-[#004d26] underline underline-offset-2 hover:text-[#00361a]"
                  >
                    Refund Policy
                  </Link>{" "}
                  or contact customer support before initiating a return.
                </p>
              </section>

              {/* Need More Help? */}
              <section className="space-y-4">
                <h2 className="flex items-center gap-2.5 border-b border-gray-200 pb-2 text-xl font-bold text-gray-900">
                  <MessageSquare className="h-5 w-5 text-[#004d26]" />
                  Need More Help?
                </h2>

                <p className="text-gray-600">
                  If you couldn&apos;t find the answer you&apos;re
                  looking for, our team is ready to assist you.
                </p>

                <div className="space-y-3 pt-1">
                  <h3 className="text-sm font-bold text-gray-900">
                    Customer Support
                  </h3>

                  <a
                    href="mailto:customer@africasuk.com"
                    className="flex items-center gap-2 text-gray-700 hover:text-[#004d26]"
                  >
                    <Mail className="h-4 w-4 text-[#004d26]" />
                    customer@africasuk.com
                  </a>

                  <a
                    href="https://wa.me/211982851779"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-700 hover:text-[#004d26]"
                  >
                    <MessageSquare className="h-4 w-4 text-[#004d26]" />
                    +211 982 851 779 (WhatsApp)
                  </a>

                  <a
                    href="tel:+211923866290"
                    className="flex items-center gap-2 text-gray-700 hover:text-[#004d26]"
                  >
                    <Phone className="h-4 w-4 text-[#004d26]" />
                    +211 923 866 290 (Phone)
                  </a>

                  <p className="text-xs text-gray-500">
                    Our team handles customer inquiries and responds
                    as promptly as possible.
                  </p>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-[#004d26] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#00361a]"
                  >
                    Contact Us
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* Before Contacting Us */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="mb-2 text-sm font-bold text-gray-900">
                    Before Contacting Us
                  </h3>

                  <p className="mb-3 text-xs text-gray-500">
                    To help us assist you faster, please include:
                  </p>

                  <ul className="space-y-2 pl-1 text-xs text-gray-700 sm:text-sm">
                    {[
                      "Your order number (if applicable)",
                      "Your registered email address",
                      "A clear description of the issue",
                      "Photos or screenshots (if relevant)",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#004d26]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-6 space-y-4 rounded-lg border border-gray-200/60 bg-gray-50/80 p-5 text-xs">

                <div className="border-b border-gray-200 pb-3 text-center">
                  <div className="mb-2 flex justify-center">
                    <HelpCircle className="h-8 w-8 text-[#004d26]" />
                  </div>

                  <h3 className="text-sm font-bold text-gray-900">
                    Support Desk
                  </h3>

                  <p className="text-[11px] text-gray-500">
                    Africa Suk Customer Care
                  </p>
                </div>

                <table className="w-full text-left">
                  <tbody>
                    <tr className="border-b border-gray-200/80">
                      <th className="w-1/3 py-2 font-semibold text-gray-600">
                        Email
                      </th>
                      <td className="break-all py-2 font-mono text-gray-900">
                        <a href="mailto:customer@africasuk.com">
                          customer@africasuk.com
                        </a>
                      </td>
                    </tr>

                    <tr className="border-b border-gray-200/80">
                      <th className="py-2 font-semibold text-gray-600">
                        WhatsApp
                      </th>
                      <td className="py-2 text-gray-900">
                        <a
                          href="https://wa.me/211982851779"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          +211 982 851 779
                        </a>
                      </td>
                    </tr>

                    <tr className="border-b border-gray-200/80">
                      <th className="py-2 font-semibold text-gray-600">
                        Phone
                      </th>
                      <td className="py-2 text-gray-900">
                        <a href="tel:+211923866290">
                          +211 923 866 290
                        </a>
                      </td>
                    </tr>

                    <tr className="border-b border-gray-200/80">
                      <th className="py-2 font-semibold text-gray-600">
                        Availability
                      </th>
                      <td className="flex items-center gap-1 py-2 text-[#004d26]">
                        <Clock className="h-3 w-3" />
                        <span>Online 24/7</span>
                      </td>
                    </tr>

                    <tr>
                      <th className="py-2 font-semibold text-gray-600">
                        Region
                      </th>
                      <td className="py-2 text-gray-900">
                        South Sudan 🇸🇸
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="border-t border-gray-200 pt-2 text-center">
                  <p className="text-[11px] italic text-gray-500">
                    &ldquo;Here to make your shopping experience
                    simple and smooth.&rdquo;
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
