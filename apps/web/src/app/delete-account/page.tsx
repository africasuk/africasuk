import {
  UserX,
  Smartphone,
  Mail,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

import Container from "@/components/layout/Container";

export default function DeleteAccountPage() {
  return (
    <div className="py-10 sm:py-16 bg-white">
      <Container>
        <div className="mx-auto max-w-5xl">
          
          {/* Header Hero Section */}
          <div className="text-center pb-10 border-b border-gray-200 mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-red-50 text-red-600 rounded-full mb-4">
              <UserX className="h-8 w-8" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Delete Your Africa Suk Account
            </h1>
            <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              At Africa Suk, we respect your privacy and give you control over your personal information. If you would like to delete your account and associated personal data, you can request account deletion at any time.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-12">
            
            {/* Main Content Column */}
            <div className="lg:col-span-8 space-y-10 text-gray-800 leading-relaxed text-sm sm:text-base">
              
              {/* How to Delete Your Account */}
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                  <Smartphone className="h-5 w-5 text-[#004d26]" />
                  <span>How to Delete Your Account</span>
                </h2>

                <div className="grid gap-6 sm:grid-cols-2 pt-2">
                  {/* Option 1 */}
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#004d26] text-xs font-bold text-white">
                        1
                      </span>
                      <h3 className="font-bold text-gray-900">From Your Account</h3>
                    </div>
                    <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside pl-1">
                      <li>Sign in to the Africa Suk app.</li>
                      <li>Open <strong>Profile</strong>.</li>
                      <li>Select <strong>Delete Account</strong>.</li>
                      <li>Follow the confirmation steps.</li>
                    </ol>
                    <p className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                      Your account deletion request will be submitted immediately.
                    </p>
                  </div>

                  {/* Option 2 */}
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#004d26] text-xs font-bold text-white">
                        2
                      </span>
                      <h3 className="font-bold text-gray-900">Contact Us</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      If you cannot access your account, send an email to:
                    </p>
                    <a
                      href="mailto:support@africasuk.com?subject=Account%20Deletion%20Request"
                      className="inline-block font-mono text-sm font-semibold text-[#004d26] hover:underline"
                    >
                      support@africasuk.com
                    </a>
                    <div className="text-xs text-gray-600 space-y-1 bg-white p-2.5 rounded border border-gray-200">
                      <p>
                        <strong>Subject:</strong> Account Deletion Request
                      </p>
                      <p>
                        <strong>Include:</strong> The email address associated with your account.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Data That Will Be Deleted */}
              <section className="space-y-3">
                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                  <Trash2 className="h-5 w-5 text-red-600" />
                  <span>Data That Will Be Deleted</span>
                </h2>
                <p className="text-gray-600">
                  When your account is deleted, we will delete eligible personal information associated with your account, including:
                </p>
                <ul className="grid sm:grid-cols-2 gap-2.5 text-gray-700 pl-1 pt-2">
                  {[
                    "Account information",
                    "Name and profile information",
                    "Email address",
                    "Phone number",
                    "Saved addresses",
                    "User preferences",
                    "Other personal data associated with your account",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-red-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Data That May Be Retained */}
              <section className="space-y-3">
                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-[#004d26]" />
                  <span>Data That May Be Retained</span>
                </h2>
                <p className="text-gray-600">
                  Some information may be retained when required for:
                </p>
                <ul className="space-y-2 text-gray-700 pl-1">
                  {[
                    "Legal or regulatory requirements",
                    "Fraud prevention and security",
                    "Accounting and financial records",
                    "Resolving disputes",
                    "Order and transaction records where retention is legally required",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#004d26] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-start gap-2.5 bg-amber-50 p-3.5 rounded-lg border border-amber-200/80 text-amber-900 text-xs sm:text-sm">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Any retained information will only be kept for the period required for the applicable purpose.
                  </span>
                </div>
              </section>

              {/* Processing Your Request */}
              <section className="space-y-3">
                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2.5">
                  <Mail className="h-5 w-5 text-[#004d26]" />
                  <span>Processing Your Request</span>
                </h2>
                <p className="text-gray-600">
                  After receiving and verifying your request, Africa Suk will process the deletion of eligible account data.
                </p>
                <p className="text-gray-600">
                  If you have questions about account deletion or your personal data, contact:
                </p>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
                  <p className="text-sm text-gray-500">Support Email</p>
                  <a
                    href="mailto:support@africasuk.com"
                    className="font-mono text-base font-bold text-gray-900 hover:text-[#004d26] transition-colors"
                  >
                    support@africasuk.com
                  </a>
                </div>
              </section>

            </div>

            {/* Sidebar Overview Box */}
            <aside className="lg:col-span-4">
              <div className="bg-gray-50/80 p-5 text-xs space-y-4 rounded-xl sticky top-6 border border-gray-200/60">
                
                <div className="text-center pb-3 border-b border-gray-200">
                  <div className="flex justify-center mb-2">
                    <HelpCircle className="h-8 w-8 text-[#004d26]" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900">Deletion Summary</h3>
                  <p className="text-gray-500 text-[11px]">Africa Suk User Rights</p>
                </div>

                <table className="w-full text-left">
                  <tbody>
                    <tr className="border-b border-gray-200/80">
                      <th className="py-2.5 font-semibold text-gray-600 w-1/3">Type</th>
                      <td className="py-2.5 text-gray-900 font-medium">Permanent Account Deletion</td>
                    </tr>
                    <tr className="border-b border-gray-200/80">
                      <th className="py-2.5 font-semibold text-gray-600">Request Method</th>
                      <td className="py-2.5 text-gray-900">App Settings or Email</td>
                    </tr>
                    <tr className="border-b border-gray-200/80">
                      <th className="py-2.5 font-semibold text-gray-600">Support</th>
                      <td className="py-2.5 text-gray-900 font-mono">support@africasuk.com</td>
                    </tr>
                  </tbody>
                </table>

                <div className="pt-2 border-t border-gray-200 text-center">
                  <p className="italic text-[11px] text-gray-500">
                    &ldquo;Africa Suk — South Sudan&apos;s trusted commerce platform.&rdquo;
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