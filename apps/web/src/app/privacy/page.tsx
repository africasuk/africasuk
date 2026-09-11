import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Mail,
  Globe,
  Calendar,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import Container from "@/components/layout/Container";

export default function PrivacyPolicyPage() {
  const sections = [
    { id: "section-1", title: "1. About Africa Suk" },
    { id: "section-2", title: "2. Information We Collect" },
    { id: "section-3", title: "3. Order and Delivery Information" },
    { id: "section-4", title: "4. Payment Information" },
    { id: "section-5", title: "5. Product Requests" },
    { id: "section-6", title: "6. Customer Support & Communications" },
    { id: "section-7", title: "7. Information Collected Automatically" },
    { id: "section-8", title: "8. Cookies & Similar Technologies" },
    { id: "section-9", title: "9. Mobile Application Data" },
    { id: "section-10", title: "10. How We Use Your Information" },
    { id: "section-11", title: "11. We Do Not Sell Your Information" },
    { id: "section-12", title: "12. When We Share Information" },
    { id: "section-13", title: "13. Third-Party Services" },
    { id: "section-14", title: "14. Google Sign-In" },
    { id: "section-15", title: "15. How We Protect Your Information" },
    { id: "section-16", title: "16. Data Retention" },
    { id: "section-17", title: "17. Account Deletion" },
    { id: "section-18", title: "18. Children's Privacy" },
    { id: "section-19", title: "19. International Data Transfers" },
    { id: "section-20", title: "20. Your Privacy Choices" },
    { id: "section-21", title: "21. Marketing Communications" },
    { id: "section-22", title: "22. Notifications" },
    { id: "section-23", title: "23. Location Information" },
    { id: "section-24", title: "24. Information You Choose to Provide" },
    { id: "section-25", title: "25. Fraud and Security" },
    { id: "section-26", title: "26. Links to Other Websites" },
    { id: "section-27", title: "27. Social Media" },
    { id: "section-28", title: "28. Changes to This Privacy Policy" },
    { id: "section-29", title: "29. Contact Us About Privacy" },
    { id: "section-30", title: "30. Final Statement" },
    { id: "section-legal-review", title: "Legal & Regulatory Review Notes" },
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
                Privacy &amp; Data Protection
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                Africa Suk Privacy Policy
              </h1>
              <p className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="h-4 w-4 text-[#004d26]" />
                <span>Last Updated: September 11, 2026</span>
              </p>
              <p className="mx-auto max-w-2xl text-base text-gray-800 leading-relaxed pt-1">
                Africa Suk respects your privacy and is committed to protecting the information you provide when using our website, mobile application, and related services.
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
                  This Privacy Policy explains how Africa Suk collects, uses, stores, protects, and shares information when you visit <strong>africasuk.com</strong>, use the Africa Suk Android application, create or use an account, browse products, place or manage an order, request a product, contact customer support, or interact with our services.
                </p>
                <p className="font-bold text-[#004d26]">
                  This Privacy Policy applies to both the Africa Suk website and mobile application.
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
                  Africa Suk is the retailer and operates the customer shopping experience through its website and mobile application. Africa Suk is not a platform where independent third-party sellers create accounts and sell products directly to customers.
                </p>
                <div className="border border-gray-200 p-4 bg-gray-50 space-y-1 text-sm font-medium">
                  <p className="font-bold text-gray-900">For privacy-related inquiries:</p>
                  <p className="text-gray-800">Email: support@africasuk.com</p>
                  <p className="text-gray-800">Website: https://www.africasuk.com</p>
                </div>
              </section>

              {/* 2. Information We Collect */}
              <section id="section-2" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  2. Information We Collect
                </h2>
                <p>
                  The information we collect depends on how you use Africa Suk. We may collect the following categories of information:
                </p>
                <h3 className="text-lg font-bold text-gray-900 pt-1">
                  2.1 Account Information
                </h3>
                <p>When you create an Africa Suk account, we may collect:</p>
                <ul className="space-y-2 pl-2">
                  {[
                    "Name",
                    "Email address",
                    "Phone number",
                    "Password or authentication information",
                    "Profile information",
                    "Account preferences",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="pt-2 text-sm text-gray-700">
                  If you use a third-party sign-in service such as Google Sign-In, we may receive information provided by that service, such as your name, email address, and profile identifier, according to the permissions and settings associated with that sign-in method.
                </p>
              </section>

              {/* 3. Order and Delivery Information */}
              <section id="section-3" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  3. Order and Delivery Information
                </h2>
                <p>
                  When you place an order, we may collect information necessary to process and deliver your purchase, including:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                  {[
                    "Customer name",
                    "Phone number",
                    "Email address",
                    "Delivery address",
                    "Order details",
                    "Products purchased",
                    "Product quantities",
                    "Order value",
                    "Delivery instructions",
                    "Order status",
                    "Transaction reference information",
                    "Customer communications relating to the order",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#004d26] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <p className="pt-2">
                  This information allows us to process your order, arrange delivery, provide customer support, and maintain transaction records.
                </p>
              </section>

              {/* 4. Payment Information */}
              <section id="section-4" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  4. Payment Information
                </h2>
                <p>
                  Depending on the payment method you choose, payment information may be processed by Africa Suk and/or the payment provider supporting the transaction. This may include payment method, transaction reference, payment status, amount paid, currency, and other information necessary to confirm the transaction.
                </p>
                <p>
                  Where payment processing is handled by a third-party payment provider, that provider may process payment information according to its own privacy policy and terms.
                </p>
                <p className="font-bold text-gray-900">
                  Africa Suk does not intentionally store complete payment card numbers or security codes unless specifically stated at the time of payment.
                </p>
              </section>

              {/* 5. Product Requests */}
              <section id="section-5" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  5. Product Requests
                </h2>
                <p>If you use our product-request service, we may collect:</p>
                <ul className="space-y-2 pl-2">
                  {[
                    "Your name",
                    "Contact information",
                    "Requested product and description",
                    "Images or links you provide",
                    "Your budget or preferences, if provided",
                    "Additional information needed to respond to your request",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-700 italic">
                  Submitting a product request does not guarantee that Africa Suk will be able to source the requested product.
                </p>
              </section>

              {/* 6. Customer Support and Communications */}
              <section id="section-6" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  6. Customer Support and Communications
                </h2>
                <p>
                  When you contact Africa Suk, we may collect information contained in your communication including your name, email address, phone number, order number, messages, attachments or images, and other information you voluntarily provide.
                </p>
                <p>
                  We use this information to respond to your questions, investigate problems, resolve complaints, and provide customer support.
                </p>
              </section>

              {/* 7. Information Collected Automatically */}
              <section id="section-7" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  7. Information Collected Automatically
                </h2>
                <p>
                  When you use our website or mobile application, certain technical information may be collected automatically, such as IP address, device type, operating system, browser type, application version, language preferences, general device information, pages or screens viewed, features used, approximate usage times, error/crash reports, and referral information.
                </p>
              </section>

              {/* 8. Cookies and Similar Technologies */}
              <section id="section-8" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  8. Cookies and Similar Technologies
                </h2>
                <p>
                  Our website may use cookies and similar technologies to keep you signed in, remember preferences, maintain shopping-cart functionality, maintain sessions, improve website performance, understand website usage, protect the site from abuse, and support security.
                </p>
                <p>
                  You can control certain cookies through your browser settings. Disabling some cookies may affect website functionality.
                </p>
              </section>

              {/* 9. Mobile Application Data */}
              <section id="section-9" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  9. Mobile Application Data
                </h2>
                <p>
                  The Africa Suk Android application collects only the information necessary to provide its functionality, such as account and order data, basic device/app information, authentication tokens, crash logs, and optional notification preferences.
                </p>
                <p>
                  The application only requests permissions that are required for its features. If a permission requires your approval, you can choose whether to grant or deny it.
                </p>
                <p className="text-sm text-gray-700 border-l-2 border-[#004d26] pl-3 py-1">
                  Google Play requires developers to disclose app data collection and sharing practices in the Play Console Data Safety section. Our Data Safety declarations are maintained to stay consistent with this policy.
                </p>
              </section>

              {/* 10. How We Use Your Information */}
              <section id="section-10" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  10. How We Use Your Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900">To Provide Our Services</h3>
                    <p className="text-sm text-gray-800">
                      Creating and managing accounts, displaying catalog items, processing orders and payments, arranging deliveries, tracking packages, processing product requests, and offering support.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">To Improve Africa Suk</h3>
                    <p className="text-sm text-gray-800">
                      Optimizing website and app functionality, identifying bugs, improving product selection, and enhancing overall customer experience.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">To Protect Africa Suk</h3>
                    <p className="text-sm text-gray-800">
                      Detecting fraud, preventing platform abuse, securing accounts, investigating suspicious transactions, and enforcing our Terms &amp; Conditions.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">To Communicate with You</h3>
                    <p className="text-sm text-gray-800">
                      Sending transactional receipts, order updates, delivery notices, support replies, service announcements, and optional promotional messages.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">To Comply with Legal Requirements</h3>
                    <p className="text-sm text-gray-800">
                      Complying with applicable laws, responding to lawful government inquiries, resolving disputes, and maintaining mandatory tax and business records.
                    </p>
                  </div>
                </div>
              </section>

              {/* 11. We Do Not Sell Your Personal Information */}
              <section id="section-11" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  11. We Do Not Sell Your Personal Information
                </h2>
                <p className="text-lg font-bold text-[#004d26]">
                  Africa Suk does not sell your personal information.
                </p>
                <p>
                  We do not sell customer names, phone numbers, email addresses, delivery addresses, payment information, or other personal data to third parties for money. Google Play also prohibits the sale of personal and sensitive user data by apps.
                </p>
              </section>

              {/* 12. When We Share Information */}
              <section id="section-12" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  12. When We Share Information
                </h2>
                <p>
                  We share limited information strictly when necessary to operate Africa Suk:
                </p>
                <ul className="space-y-3 pl-2">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900">Service Providers:</strong> Cloud hosting, database infrastructure, image storage, authentication, analytics, diagnostics, and payment gateways processing data on our behalf.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900">Delivery &amp; Logistics:</strong> Supplying delivery personnel only with the essential customer name, phone number, address, and delivery instructions needed to complete fulfillment.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900">Legal &amp; Regulatory Authorities:</strong> When required by applicable law, court order, regulatory mandate, or to protect public and platform safety against fraud.
                    </div>
                  </li>
                </ul>
              </section>

              {/* 13. Third-Party Services */}
              <section id="section-13" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  13. Third-Party Services
                </h2>
                <p>
                  Africa Suk relies on third-party technology providers to operate infrastructure, analytics, communications, and database systems (such as Supabase, Vercel, Cloudinary, Google services, and payment providers).
                </p>
                <p>
                  Third-party providers process information according to their own privacy policies and contractual obligations. Where required, we take reasonable steps to ensure service providers handle customer data appropriately.
                </p>
              </section>

              {/* 14. Google Sign-In */}
              <section id="section-14" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  14. Google Sign-In
                </h2>
                <p>
                  If you choose Google Sign-In, Google provides Africa Suk with information permitted by your authentication consent (such as name, email address, and profile identifier).
                </p>
                <p className="font-semibold text-gray-900">
                  Africa Suk never receives your Google account password through Google Sign-In.
                </p>
              </section>

              {/* 15. How We Protect Your Information */}
              <section id="section-15" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  15. How We Protect Your Information
                </h2>
                <p>
                  We apply technical and organizational safeguards including HTTPS encryption, authentication controls, database access restrictions, secure cloud infrastructure, regular software updates, and monitoring.
                </p>
                <p>
                  While we take all reasonable steps to safeguard your data, no internet-based service is 100% secure. You are also responsible for safeguarding your login credentials.
                </p>
              </section>

              {/* 16. Data Retention */}
              <section id="section-16" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  16. Data Retention
                </h2>
                <p>
                  We retain personal information only for as long as necessary for the purposes set out in this policy:
                </p>
                <ul className="space-y-2 pl-2">
                  {[
                    "Account info is retained while your account remains active.",
                    "Order and transaction records are retained for accounting, legal, and fraud-prevention requirements.",
                    "Customer support logs are kept for a reasonable period to resolve inquiries.",
                    "Technical logs are kept as needed for troubleshooting and security audits.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-[#004d26] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 17. Account Deletion */}
              <section id="section-17" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  17. Account Deletion
                </h2>
                <p>
                  You may request deletion of your Africa Suk account at any time through the account settings in the application or website, or by emailing <strong>support@africasuk.com</strong>.
                </p>
                <p>
                  Upon request, we will take reasonable steps to delete or anonymize personal data, subject to records we are legally required or permitted to retain (such as completed transaction invoices, tax audits, or dispute defense records).
                </p>
              </section>

              {/* 18. Children's Privacy */}
              <section id="section-18" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  18. Children&apos;s Privacy
                </h2>
                <p>
                  Africa Suk is intended for general audiences and is not directed to children. We do not knowingly collect personal information from children in violation of applicable laws. If you believe a child has submitted personal data without permission, please contact us at support@africasuk.com.
                </p>
              </section>

              {/* 19. International Data Transfers */}
              <section id="section-19" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  19. International Data Transfers
                </h2>
                <p>
                  While Africa Suk operates in South Sudan, our cloud infrastructure, database hosting, authentication, and payment providers may operate data centers in other countries. Where information is transferred internationally, we take reasonable steps to use reputable providers with secure transmission protocols.
                </p>
              </section>

              {/* 20. Your Privacy Choices */}
              <section id="section-20" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  20. Your Privacy Choices
                </h2>
                <p>
                  Depending on applicable legal provisions, you have rights regarding your personal information, including requesting access, requesting correction of inaccurate details, requesting account deletion, opting out of promotional emails, and raising privacy inquiries with our support team.
                </p>
              </section>

              {/* 21. Marketing Communications */}
              <section id="section-21" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  21. Marketing Communications
                </h2>
                <p>
                  You can opt out of promotional communications at any time by clicking the unsubscribe link in emails or contacting support@africasuk.com. You will still receive essential transactional messages regarding your active orders and account security.
                </p>
              </section>

              {/* 22. Notifications */}
              <section id="section-22" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  22. Notifications
                </h2>
                <p>
                  The Africa Suk mobile app provides push notifications for orders, payment updates, and delivery alerts. You can manage or disable notification permissions at any time through your mobile device system settings.
                </p>
              </section>

              {/* 23. Location Information */}
              <section id="section-23" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  23. Location Information
                </h2>
                <p>
                  Africa Suk does not require continuous precise location tracking simply to browse products. If precise location is ever needed for a specific feature (such as delivery pinpoints), we will request explicit permission first.
                </p>
              </section>

              {/* 24. Information You Choose to Provide */}
              <section id="section-24" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  24. Information You Choose to Provide
                </h2>
                <p>
                  Please only submit information that is directly necessary when making product requests, sending feedback, or contacting customer support. Do not submit sensitive personal details or payment credentials in open support messages.
                </p>
              </section>

              {/* 25. Fraud and Security */}
              <section id="section-25" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  25. Fraud and Security
                </h2>
                <p>
                  We monitor and process data to detect and prevent fraudulent orders, stolen payment attempts, unauthorized logins, and account abuse to safeguard customers and maintain platform integrity.
                </p>
              </section>

              {/* 26. Links to Other Websites */}
              <section id="section-26" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  26. Links to Other Websites
                </h2>
                <p>
                  Our platform may contain links to third-party websites. Africa Suk is not responsible for the privacy policies, data security, or content of those external services.
                </p>
              </section>

              {/* 27. Social Media */}
              <section id="section-27" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  27. Social Media
                </h2>
                <p>
                  If you interact with Africa Suk through social platforms (Instagram, Facebook, X, YouTube, LinkedIn, Threads), those interactions are subject to the respective privacy policies and terms of those platforms.
                </p>
              </section>

              {/* 28. Changes to This Privacy Policy */}
              <section id="section-28" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  28. Changes to This Privacy Policy
                </h2>
                <p>
                  We may update this Privacy Policy as our services develop or as legal requirements change. When changes occur, we will update the &ldquo;Last Updated&rdquo; date at the top of this page.
                </p>
              </section>

              {/* 29. Contact Us About Privacy */}
              <section id="section-29" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  29. Contact Us About Privacy
                </h2>
                <div className="border border-gray-300 p-5 bg-gray-50 space-y-2">
                  <p className="font-extrabold text-gray-900">Africa Suk</p>
                  <p className="flex items-center gap-2 text-gray-800">
                    <Mail className="h-4 w-4 text-[#004d26]" />
                    <span>Email: <strong>support@africasuk.com</strong></span>
                  </p>
                  <p className="flex items-center gap-2 text-gray-800">
                    <Globe className="h-4 w-4 text-[#004d26]" />
                    <span>Website: <strong>https://www.africasuk.com</strong></span>
                  </p>
                  <p className="text-xs text-gray-600 pt-2">
                    When contacting us about an account, please provide your registered email or order number. Never send your account password or payment card security codes.
                  </p>
                </div>
              </section>

              {/* 30. Final Statement */}
              <section id="section-30" className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                  30. Final Statement
                </h2>
                <p>
                  Africa Suk is committed to handling customer information responsibly. We collect information primarily to provide our shopping service, process orders, deliver products, support customers, maintain account functionality, improve Africa Suk, and protect our platform.
                </p>
                <p className="font-bold text-gray-900">
                  We do not sell your personal information. Shop with Confidence.
                </p>
              </section>

              {/* Section: Legal & Regulatory Review */}
              <section id="section-legal-review" className="space-y-4 pt-6 border-t-2 border-gray-300">
                <div className="flex items-center gap-2 text-[#004d26]">
                  <ShieldCheck className="h-5 w-5" />
                  <h2 className="text-xl font-bold text-gray-900">
                    South Sudan Legal &amp; Regulatory Review
                  </h2>
                </div>
                
                <p className="text-sm text-gray-700">
                  This policy outlines Africa Suk&apos;s current data-handling standards. The company maintains internal alignment with South Sudanese legal frameworks:
                </p>

                <div className="space-y-3 text-sm text-gray-800">
                  <div className="border border-gray-200 p-3 bg-gray-50">
                    <strong className="block text-gray-900 mb-1">Constitutional Rights &amp; NCA Compliance</strong>
                    Under South Sudan&apos;s Transitional Constitution and the National Communication Authority (NCA) regulatory mandate, customer correspondence and privacy protections are upheld.
                  </div>
                  <div className="border border-gray-200 p-3 bg-gray-50">
                    <strong className="block text-gray-900 mb-1">Consumer Protection &amp; Electronic Commerce</strong>
                    Disclosures and customer transaction terms are maintained in accordance with the Consumer Protection Act, 2011 to ensure fair, clear representation without misleading statements.
                  </div>
                  <div className="border border-gray-200 p-3 bg-gray-50">
                    <strong className="block text-gray-900 mb-1">Revenue Authority &amp; Record Preservation</strong>
                    Transaction and invoice records are preserved in accordance with South Sudan Revenue Authority (SSRA) requirements for legally registered businesses operating under an official TIN.
                  </div>
                </div>

                <p className="text-xs text-gray-500 italic">
                  Note: This regulatory section is provided for transparency and internal governance.
                </p>
              </section>

            </div>

            {/* Sidebar: Infobox & Navigation */}
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
                  <p className="text-xs font-semibold text-gray-700">Privacy Policy Overview</p>
                </div>

                <table className="w-full text-left text-sm mt-3">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <th className="py-2.5 font-bold text-gray-900 w-1/3 align-top">Scope</th>
                      <td className="py-2.5 text-gray-900 font-semibold align-top">Website &amp; Android App</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="py-2.5 font-bold text-gray-900 align-top">Data Sale</th>
                      <td className="py-2.5 text-emerald-800 font-bold align-top">Never Sold</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="py-2.5 font-bold text-gray-900 align-top">Security</th>
                      <td className="py-2.5 text-gray-800 font-medium align-top">HTTPS &amp; Encrypted Auth</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="py-2.5 font-bold text-gray-900 align-top">Deletion</th>
                      <td className="py-2.5 text-gray-800 font-medium align-top">User-initiated On-Demand</td>
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
                  <span>Privacy Policy Index</span>
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