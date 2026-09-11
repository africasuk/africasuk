import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Mail,
  Globe,
  CheckCircle2,
  Calendar,
} from "lucide-react";

import Container from "@/components/layout/Container";

export default function TermsPage() {
  const sections = [
    { id: "section-1", title: "1. About Africa Suk" },
    { id: "section-2", title: "2. Acceptance of These Terms" },
    { id: "section-3", title: "3. Website and Mobile Application" },
    { id: "section-4", title: "4. Creating an Account" },
    { id: "section-5", title: "5. Products" },
    { id: "section-6", title: "6. Product Availability" },
    { id: "section-7", title: "7. Product Prices" },
    { id: "section-8", title: "8. Pricing Errors" },
    { id: "section-9", title: "9. Placing an Order" },
    { id: "section-10", title: "10. Order Acceptance & Cancellation" },
    { id: "section-11", title: "11. Payment" },
    { id: "section-12", title: "12. Cash on Delivery" },
    { id: "section-13", title: "13. Delivery" },
    { id: "section-14", title: "14. Delivery in Juba & Other Locations" },
    { id: "section-15", title: "15. Order Tracking" },
    { id: "section-16", title: "16. Product Requests" },
    { id: "section-17", title: "17. Returns and Refunds" },
    { id: "section-18", title: "18. Damaged or Incorrect Products" },
    { id: "section-19", title: "19. Authenticity & Brand Information" },
    { id: "section-20", title: "20. Product Information & Images" },
    { id: "section-21", title: "21. Prohibited Products & Activities" },
    { id: "section-22", title: "22. Intellectual Property" },
    { id: "section-23", title: "23. Acceptable Use" },
    { id: "section-24", title: "24. Third-Party Services" },
    { id: "section-25", title: "25. Mobile Application" },
    { id: "section-26", title: "26. Account and Platform Security" },
    { id: "section-27", title: "27. Availability of the Platform" },
    { id: "section-28", title: "28. Limitation of Liability" },
    { id: "section-29", title: "29. Events Beyond Our Control" },
    { id: "section-30", title: "30. Customer Communications" },
    { id: "section-31", title: "31. Privacy" },
    { id: "section-32", title: "32. Links to Other Websites" },
    { id: "section-33", title: "33. Suspension or Termination" },
    { id: "section-34", title: "34. Changes to These Terms" },
    { id: "section-35", title: "35. Governing Law" },
    { id: "section-36", title: "36. Severability" },
    { id: "section-37", title: "37. Entire Agreement" },
    { id: "section-38", title: "38. Contact Us" },
  ];

  const productCategories = [
    "Electronics",
    "Phones and accessories",
    "Laptops",
    "Fashion",
    "Shoes",
    "Bags",
    "Watches",
    "Beauty and fragrance",
    "Home and kitchen",
    "Food and everyday essentials",
    "Baby products",
    "Office and school products",
    "Automotive products",
    "Gifts",
    "Other products available through Africa Suk",
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
                Legal Documentation
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                Terms &amp; Conditions
              </h1>
              <p className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="h-4 w-4 text-[#004d26]" />
                <span>Last Updated: September 11, 2026</span>
              </p>
              <p className="mx-auto max-w-2xl text-base text-gray-800 leading-relaxed pt-1">
                Please read these terms carefully before accessing or using the Africa Suk website, mobile application, and related services.
              </p>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-12 items-start mt-6">
            
            {/* Main Content Column */}
            <div className="lg:col-span-8 space-y-10 leading-relaxed text-base text-gray-800">
              
              {/* Intro Banner */}
              <section className="space-y-4 bg-gray-50 border border-gray-200 p-5">
                <p className="font-medium text-gray-900 text-lg">
                  Welcome to Africa Suk.
                </p>
                <p>
                  These Terms &amp; Conditions govern your use of the Africa Suk website, mobile application, and related services. By accessing or using Africa Suk, creating an account, browsing products, placing an order, or using any of our services, you agree to these Terms.
                </p>
                <p className="font-bold text-[#004d26]">
                  Please read them carefully before using Africa Suk.
                </p>
              </section>

              {/* 1. About Africa Suk */}
              <section id="section-1" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  1. About Africa Suk
                </h2>
                <p>
                  Africa Suk is a South Sudanese online shopping brand that sources products from regional and international suppliers and sells them directly to customers in South Sudan.
                </p>
                <p>
                  Africa Suk operates its own product catalog and customer shopping experience. Africa Suk is not a platform where independent third-party sellers create seller accounts and sell directly to customers.
                </p>
                <p>
                  Our products may be sourced from suppliers in South Sudan, Kenya, and other markets depending on availability.
                </p>
                <p>
                  Our goal is to make it easier for customers in South Sudan to find and purchase products through one online shopping platform.
                </p>
              </section>

              {/* 2. Acceptance of These Terms */}
              <section id="section-2" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  2. Acceptance of These Terms
                </h2>
                <p>By accessing or using the Africa Suk website or mobile application, you confirm that:</p>
                <ul className="space-y-2 pl-2">
                  {[
                    "You have read and understood these Terms.",
                    "You agree to comply with these Terms.",
                    "You will provide accurate information when required.",
                    "You will use Africa Suk only for lawful purposes.",
                    "You are responsible for activity carried out through your account.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="font-semibold text-red-700 pt-1">
                  If you do not agree with these Terms, please do not use Africa Suk.
                </p>
              </section>

              {/* 3. Africa Suk Website and Mobile Application */}
              <section id="section-3" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  3. Africa Suk Website and Mobile Application
                </h2>
                <p>Africa Suk may be accessed through:</p>
                <ul className="space-y-2 pl-2">
                  {[
                    "The Africa Suk website",
                    "The Africa Suk Android application",
                    "Other official Africa Suk digital services",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  We may update, modify, suspend, or discontinue parts of our website or application from time to time. We do not guarantee that every feature will always be available or that the platform will always operate without interruption.
                </p>
              </section>

              {/* 4. Creating an Account */}
              <section id="section-4" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  4. Creating an Account
                </h2>
                <p>
                  Some Africa Suk features may require you to create an account. When creating an account, you agree to provide accurate and current information.
                </p>
                <p className="font-bold text-gray-900">You are responsible for:</p>
                <ul className="space-y-2 pl-2">
                  {[
                    "Keeping your login information secure.",
                    "Keeping your account information accurate.",
                    "Not sharing your password or authentication credentials.",
                    "Informing us if you believe your account has been accessed without authorization.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  You are responsible for activity carried out through your account unless the activity resulted from circumstances outside your reasonable control.
                </p>
                <p>
                  We may suspend or restrict an account if we reasonably believe it is being used fraudulently, unlawfully, abusively, or in violation of these Terms.
                </p>
              </section>

              {/* 5. Products */}
              <section id="section-5" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  5. Products
                </h2>
                <p>Africa Suk offers products across different categories, including:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pl-2">
                  {productCategories.map((cat) => (
                    <div key={cat} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>{cat}</span>
                    </div>
                  ))}
                </div>
                <p className="pt-2">Product availability may change at any time.</p>
                <p>
                  We make reasonable efforts to ensure product information, descriptions, images, specifications, and prices are accurate. However, minor differences may occur between product images and the actual product, including differences in color, packaging, dimensions, or appearance.
                </p>
              </section>

              {/* 6. Product Availability */}
              <section id="section-6" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  6. Product Availability
                </h2>
                <p>
                  Adding a product to your cart does not guarantee that the product will remain available until checkout or delivery. Products may become unavailable because of:
                </p>
                <ul className="space-y-2 pl-2">
                  {[
                    "Limited stock",
                    "Supplier availability",
                    "Stock discrepancies",
                    "Product discontinuation",
                    "Supply or transportation issues",
                    "Other circumstances outside our reasonable control",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  If a product becomes unavailable after an order is placed, Africa Suk may contact you regarding the available options, including cancellation or refund where applicable.
                </p>
              </section>

              {/* 7. Product Prices */}
              <section id="section-7" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  7. Product Prices
                </h2>
                <p>
                  Prices displayed on Africa Suk are shown in the applicable currency displayed on the website or application. Prices may change at any time before an order is confirmed.
                </p>
                <p className="font-bold text-gray-900">Where applicable, additional charges may include:</p>
                <ul className="space-y-2 pl-2">
                  {[
                    "Delivery fees",
                    "Applicable taxes",
                    "Customs or import-related charges",
                    "Other charges clearly communicated before or during checkout",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  The price applicable to an order is the price presented to you at the time the order is confirmed, subject to correction of obvious pricing errors.
                </p>
              </section>

              {/* 8. Pricing Errors */}
              <section id="section-8" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  8. Pricing Errors
                </h2>
                <p>
                  We make reasonable efforts to display accurate prices. However, technical errors, incorrect product information, supplier updates, or other circumstances may occasionally result in an incorrect price being displayed.
                </p>
                <p>
                  If an obvious pricing error affects an order, Africa Suk may contact you before fulfilling the order. Where necessary, we may cancel the affected order and provide an appropriate refund for any payment already received.
                </p>
              </section>

              {/* 9. Placing an Order */}
              <section id="section-9" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  9. Placing an Order
                </h2>
                <p>
                  When you place an order through Africa Suk, you are submitting a request to purchase the selected products. After receiving your order, we may provide an order confirmation containing information such as order number, products ordered, quantity, price, delivery information, payment information, and applicable charges.
                </p>
                <p>
                  An order confirmation does not necessarily mean that the order has already been dispatched. We may contact you to verify order information before processing or delivering an order.
                </p>
              </section>

              {/* 10. Order Acceptance and Cancellation */}
              <section id="section-10" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  10. Order Acceptance and Cancellation
                </h2>
                <p>
                  Africa Suk reserves the right to accept, reject, or cancel an order where reasonably necessary. An order may be cancelled because of:
                </p>
                <ul className="space-y-2 pl-2">
                  {[
                    "Product unavailability",
                    "Incorrect pricing",
                    "Incorrect or incomplete customer information",
                    "Suspected fraud",
                    "Payment problems",
                    "Delivery limitations",
                    "Product or supplier issues",
                    "Legal or regulatory requirements",
                    "Circumstances beyond our reasonable control",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  If we cancel an order for which payment has already been received, we will provide a refund where applicable. Customers may request cancellation before an order has reached a stage where cancellation is no longer reasonably possible.
                </p>
              </section>

              {/* 11. Payment */}
              <section id="section-11" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  11. Payment
                </h2>
                <p>
                  Africa Suk may offer different payment methods depending on availability, including:
                </p>
                <ul className="space-y-2 pl-2">
                  {[
                    "Cash on delivery",
                    "Online payment",
                    "Mobile or electronic payment methods",
                    "Other payment methods displayed at checkout",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  Payment methods may vary depending on location, order value, product, and availability. When using a third-party payment provider, the payment provider may apply its own terms and policies. Africa Suk does not store payment card information unless specifically stated in our Privacy Policy.
                </p>
              </section>

              {/* 12. Cash on Delivery */}
              <section id="section-12" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  12. Cash on Delivery
                </h2>
                <p>
                  Where Cash on Delivery is available, payment must be made according to the instructions provided when the order is placed or delivered.
                </p>
                <p>
                  Cash on Delivery may not be available for every product, customer, location, or order. Africa Suk may restrict Cash on Delivery for certain orders where necessary to reduce fraud, failed deliveries, or other operational risks.
                </p>
              </section>

              {/* 13. Delivery */}
              <section id="section-13" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  13. Delivery
                </h2>
                <p>
                  Africa Suk currently focuses its delivery operations on locations where we can reasonably provide delivery services. Delivery availability, fees, and estimated delivery times may vary depending on customer location, product availability, order size, delivery method, transportation conditions, weather, public holidays, security conditions, and customs or import procedures.
                </p>
                <p>
                  Any delivery timeframe displayed on Africa Suk is an estimate unless expressly stated otherwise. Providing an incorrect or incomplete delivery address may result in delays, additional charges, or failure to deliver the order.
                </p>
              </section>

              {/* 14. Delivery in Juba and Other Locations */}
              <section id="section-14" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  14. Delivery in Juba and Other Locations
                </h2>
                <p>
                  Where delivery is available, the applicable delivery areas and charges will be communicated through the website, application, checkout process, or customer support.
                </p>
                <p>
                  Africa Suk may expand delivery locations over time. A location being displayed on the website does not necessarily guarantee delivery availability for every product or order.
                </p>
              </section>

              {/* 15. Order Tracking */}
              <section id="section-15" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  15. Order Tracking
                </h2>
                <p>
                  Where tracking is available, customers may use the tracking information provided by Africa Suk to view the status of their order.
                </p>
                <p>
                  Tracking information may be delayed or temporarily unavailable due to operational or technical reasons.
                </p>
              </section>

              {/* 16. Product Requests */}
              <section id="section-16" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  16. Product Requests
                </h2>
                <p>
                  Africa Suk may allow customers to request products that are not currently available in the catalog. Submitting a product request does not guarantee that Africa Suk will be able to source or sell the requested product.
                </p>
                <p>
                  Product requests may depend on supplier availability, product legality, import requirements, price, shipping costs, availability in regional markets, product restrictions, and other operational considerations. If we are able to source a requested product, we may provide additional information about its availability and price before an order is placed.
                </p>
              </section>

              {/* 17. Returns and Refunds */}
              <section id="section-17" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  17. Returns and Refunds
                </h2>
                <p>
                  Returns and refunds are handled according to the Africa Suk Returns &amp; Refund Policy. A product may qualify for a return or refund depending on factors such as:
                </p>
                <ul className="space-y-2 pl-2">
                  {[
                    "Product condition",
                    "Reason for return",
                    "Time since delivery",
                    "Product category",
                    "Whether the product is defective, damaged, incorrect, or incomplete",
                    "Applicable return conditions",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  Customers should inspect products after receiving them and contact Africa Suk as soon as possible if there is a problem. Certain products may have specific return restrictions for hygiene, safety, consumable, personalized, or other legitimate reasons. Please review our Returns &amp; Refund Policy before placing an order.
                </p>
              </section>

              {/* 18. Damaged or Incorrect Products */}
              <section id="section-18" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  18. Damaged or Incorrect Products
                </h2>
                <p>
                  If you receive a damaged product, the wrong product, a missing item, or a product with a significant defect, please contact Africa Suk through our official support channels as soon as possible.
                </p>
                <p>We may request:</p>
                <ul className="space-y-2 pl-2">
                  {[
                    "Order information",
                    "Photographs or videos",
                    "Product packaging",
                    "Delivery information",
                    "Other information reasonably necessary to investigate the issue",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  Depending on the circumstances, Africa Suk may offer a replacement, return, refund, or another appropriate resolution.
                </p>
              </section>

              {/* 19. Product Authenticity and Brand Information */}
              <section id="section-19" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  19. Product Authenticity and Brand Information
                </h2>
                <p>
                  Africa Suk aims to provide accurate information about the products and brands listed on the platform. Where a product is described as belonging to a particular brand, that information should correspond to the product being offered.
                </p>
                <p>
                  Africa Suk does not claim that every product available on the platform is manufactured by or officially partnered with the brand displayed unless expressly stated. We do not represent ourselves as an authorized distributor, official partner, or representative of a brand unless such relationship actually exists.
                </p>
                <p className="font-semibold text-gray-900">
                  Products must not be represented as branded products when they are not genuine products of that brand.
                </p>
              </section>

              {/* 20. Product Information and Images */}
              <section id="section-20" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  20. Product Information and Images
                </h2>
                <p>
                  Product images are provided to help customers understand the product. Actual products may have minor differences in color, packaging, design details, size, accessories, manufacturer packaging, or other visual characteristics.
                </p>
                <p>
                  Such differences do not necessarily mean that the wrong product has been delivered. Where specifications are important to a purchase, customers should review the product description and specifications before ordering.
                </p>
              </section>

              {/* 21. Prohibited Products and Activities */}
              <section id="section-21" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  21. Prohibited Products and Activities
                </h2>
                <p>
                  Customers must not use Africa Suk to purchase, request, distribute, or promote products or activities that are illegal or prohibited by applicable law. Africa Suk may refuse orders involving products that we believe may violate applicable laws, regulations, safety requirements, intellectual-property rights, or our internal policies.
                </p>
                <p className="font-bold text-gray-900">Prohibited items include:</p>
                <ul className="space-y-2 pl-2">
                  {[
                    "Counterfeit goods",
                    "Illegal drugs",
                    "Weapons or prohibited items",
                    "Fraudulent products",
                    "Hazardous materials",
                    "Products requiring permits that cannot be obtained",
                    "Products restricted from importation",
                    "Other unlawful products",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 22. Intellectual Property */}
              <section id="section-22" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  22. Intellectual Property
                </h2>
                <p>
                  The Africa Suk name, logo, website design, application interface, graphics, text, photographs, software, and other original content associated with Africa Suk are protected by applicable intellectual-property laws.
                </p>
                <p>Unless permitted by Africa Suk or applicable law, you may not:</p>
                <ul className="space-y-2 pl-2">
                  {[
                    "Copy our website or application",
                    "Reproduce our branding",
                    "Republish our content",
                    "Modify our platform",
                    "Reverse engineer our software",
                    "Use Africa Suk branding in a misleading manner",
                    "Scrape or systematically collect our content for unauthorized purposes",
                    "Create a service that falsely suggests an affiliation with Africa Suk",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  Product names, trademarks, and logos belonging to their respective owners remain the property of those owners.
                </p>
              </section>

              {/* 23. Acceptable Use */}
              <section id="section-23" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  23. Acceptable Use
                </h2>
                <p>You agree not to:</p>
                <ul className="space-y-2 pl-2">
                  {[
                    "Use Africa Suk for unlawful purposes.",
                    "Attempt to gain unauthorized access to our systems.",
                    "Interfere with the operation of the website or application.",
                    "Introduce malicious software or code.",
                    "Attempt to access another customer's account.",
                    "Submit fraudulent orders.",
                    "Use stolen payment information.",
                    "Abuse promotions or discounts.",
                    "Create accounts for fraudulent purposes.",
                    "Attempt to manipulate prices or orders.",
                    "Use automated systems to abuse or disrupt Africa Suk.",
                    "Misrepresent your identity or information.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  We may restrict or terminate access where necessary to protect Africa Suk, customers, suppliers, payment providers, or other parties.
                </p>
              </section>

              {/* 24. Third-Party Services */}
              <section id="section-24" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  24. Third-Party Services
                </h2>
                <p>
                  Africa Suk may use third-party services to provide certain functions, including payment processing, authentication, cloud hosting, analytics, notifications, maps or location services, communications, and delivery or logistics services.
                </p>
                <p>
                  Third-party services may have their own terms and privacy policies. Your use of those services may be subject to their respective terms.
                </p>
              </section>

              {/* 25. Mobile Application */}
              <section id="section-25" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  25. Mobile Application
                </h2>
                <p>
                  When you use the Africa Suk mobile application, additional technical information may be processed to provide application functionality, security, notifications, analytics, and other services as described in our Privacy Policy.
                </p>
                <p>
                  You must install the application from an official or authorized distribution channel and keep the application updated where updates are available. We may release updates that introduce new features, improve performance, correct bugs, or modify existing functionality.
                </p>
              </section>

              {/* 26. Account and Platform Security */}
              <section id="section-26" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  26. Account and Platform Security
                </h2>
                <p>
                  We take reasonable measures to protect Africa Suk and customer accounts. However, no online system can be guaranteed to be completely secure.
                </p>
                <p>You should:</p>
                <ul className="space-y-2 pl-2">
                  {[
                    "Use a strong password.",
                    "Keep your password private.",
                    "Avoid sharing authentication codes.",
                    "Log out of accounts on shared devices.",
                    "Contact us if you believe your account has been compromised.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  You must not attempt to bypass security mechanisms or gain unauthorized access to Africa Suk systems.
                </p>
              </section>

              {/* 27. Availability of the Platform */}
              <section id="section-27" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  27. Availability of the Platform
                </h2>
                <p>
                  We aim to keep Africa Suk available and functional, but we do not guarantee uninterrupted access. The platform may occasionally be unavailable because of maintenance, software updates, hosting problems, internet outages, power interruptions, cybersecurity incidents, technical failures, third-party service failures, or events beyond our reasonable control.
                </p>
              </section>

              {/* 28. Limitation of Liability */}
              <section id="section-28" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  28. Limitation of Liability
                </h2>
                <p>
                  To the extent permitted by applicable law, Africa Suk will not be responsible for losses resulting from circumstances outside our reasonable control, including internet or network failures, power outages, transportation delays, customs delays, supplier delays, natural events, government restrictions, security conditions, third-party service failures, or technical failures.
                </p>
                <p className="font-semibold text-gray-900">
                  Nothing in these Terms is intended to exclude or limit any liability or consumer right that cannot legally be excluded or limited under applicable law.
                </p>
              </section>

              {/* 29. Events Beyond Our Control */}
              <section id="section-29" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  29. Events Beyond Our Control
                </h2>
                <p>
                  Africa Suk will not be responsible for delays or failure to perform an obligation where the delay or failure results from circumstances beyond our reasonable control, including natural disasters, floods, fires, epidemics or pandemics, war, civil unrest, security incidents, government actions, border restrictions, transportation disruption, customs delays, strikes, major infrastructure failures, or telecommunications or internet failures.
                </p>
                <p>Where possible, we will take reasonable steps to minimize the impact.</p>
              </section>

              {/* 30. Customer Communications */}
              <section id="section-30" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  30. Customer Communications
                </h2>
                <p>
                  By using Africa Suk and providing your contact information, you may receive communications necessary to operate your account or fulfill your orders, such as order confirmations, payment updates, delivery updates, tracking details, account notifications, and customer support messages.
                </p>
                <p>
                  Where legally permitted and where you have the appropriate option, you may also receive promotional communications. You can manage promotional communications through the available unsubscribe or communication settings.
                </p>
              </section>

              {/* 31. Privacy */}
              <section id="section-31" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  31. Privacy
                </h2>
                <p>
                  Your use of Africa Suk is also governed by our Privacy Policy. The Privacy Policy explains how we collect, use, store, and protect information relating to your use of our website and mobile application. By using Africa Suk, you acknowledge that you have reviewed our Privacy Policy.
                </p>
              </section>

              {/* 32. Links to Other Websites */}
              <section id="section-32" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  32. Links to Other Websites
                </h2>
                <p>
                  Africa Suk may contain links to third-party websites or services. We do not control third-party websites and are not responsible for their content, availability, security, or privacy practices. You should review the terms and privacy policies of third-party services before using them.
                </p>
              </section>

              {/* 33. Suspension or Termination */}
              <section id="section-33" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  33. Suspension or Termination
                </h2>
                <p>
                  Africa Suk may suspend or terminate your access to your account or parts of the platform where reasonably necessary, including where you breach these Terms, your activity is fraudulent or unlawful, your account creates a security risk, you abuse our services, we are required to do so by law, or we discontinue a particular service.
                </p>
                <p>Termination does not remove obligations that arose before termination.</p>
              </section>

              {/* 34. Changes to These Terms */}
              <section id="section-34" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  34. Changes to These Terms
                </h2>
                <p>
                  We may update these Terms from time to time. When we make changes, we will update the Last Updated date at the top of this page.
                </p>
                <p>
                  Your continued use of Africa Suk after updated Terms are published means that you accept the updated Terms, to the extent permitted by applicable law. For material changes, we may provide additional notice where appropriate.
                </p>
              </section>

              {/* 35. Governing Law */}
              <section id="section-35" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  35. Governing Law
                </h2>
                <p>
                  These Terms are governed by the applicable laws of the Republic of South Sudan. Any dispute relating to your use of Africa Suk or a transaction with Africa Suk will be handled in accordance with applicable South Sudanese law and the jurisdiction of the appropriate courts or dispute-resolution mechanisms.
                </p>
                <p>
                  Nothing in these Terms is intended to remove or restrict rights that consumers have under mandatory applicable law. South Sudan&apos;s Consumer Protection Act, 2011 contains protections concerning consumer transactions and prohibits unfair or misleading representations, among other protections.
                </p>
              </section>

              {/* 36. Severability */}
              <section id="section-36" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  36. Severability
                </h2>
                <p>
                  If any provision of these Terms is found to be invalid, unlawful, or unenforceable, that provision will be interpreted or removed to the extent necessary, while the remaining provisions will continue to apply.
                </p>
              </section>

              {/* 37. Entire Agreement */}
              <section id="section-37" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  37. Entire Agreement
                </h2>
                <p>
                  These Terms, together with our Privacy Policy, Returns &amp; Refund Policy, and any other policies specifically referenced by Africa Suk, form the terms governing your use of Africa Suk and your transactions with us.
                </p>
                <p>
                  If there is a conflict between these Terms and a mandatory legal requirement, the applicable legal requirement will prevail.
                </p>
              </section>

              {/* 38. Contact Us */}
              <section id="section-38" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  38. Contact Us
                </h2>
                <p>
                  If you have questions about these Terms, your account, an order, or our services, contact Africa Suk through our official support channels:
                </p>
                <div className="border border-gray-300 p-5 bg-gray-50 space-y-2">
                  <p className="font-extrabold text-gray-900">Africa Suk</p>
                  <p className="flex items-center gap-2 text-gray-800">
                    <Mail className="h-4 w-4 text-[#004d26]" />
                    <span>Email: <strong>support@africasuk.com</strong></span>
                  </p>
                  <p className="flex items-center gap-2 text-gray-800">
                    <Globe className="h-4 w-4 text-[#004d26]" />
                    <span>Website: <strong>www.africasuk.com</strong></span>
                  </p>
                  <p className="text-xs text-gray-600 pt-2">
                    For order-related questions, please include your order number whenever possible so that we can assist you more quickly.
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
                  <p className="text-xs font-semibold text-gray-700">Terms &amp; Conditions Summary</p>
                </div>

                <table className="w-full text-left text-sm mt-3">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <th className="py-2.5 font-bold text-gray-900 w-1/3 align-top">Jurisdiction</th>
                      <td className="py-2.5 text-gray-900 font-semibold align-top">Republic of South Sudan 🇸🇸</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="py-2.5 font-bold text-gray-900 align-top">Entity Type</th>
                      <td className="py-2.5 text-gray-800 font-medium align-top">Direct Retailer (Catalog Operator)</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="py-2.5 font-bold text-gray-900 align-top">Scope</th>
                      <td className="py-2.5 text-gray-800 font-medium align-top">Website, Android App &amp; Sourcing</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="py-2.5 font-bold text-gray-900 align-top">Effective</th>
                      <td className="py-2.5 text-gray-800 font-medium align-top">September 11, 2026</td>
                    </tr>
                    <tr>
                      <th className="py-2.5 font-bold text-gray-900 align-top">Contact</th>
                      <td className="py-2.5 text-gray-800 font-mono text-xs align-top">support@africasuk.com</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Table of Contents */}
              <div className="bg-white p-5 border border-gray-300 sticky top-6">
                <h3 className="font-bold text-base text-gray-900 border-b border-gray-300 pb-2 mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#004d26]" />
                  <span>Table of Contents</span>
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