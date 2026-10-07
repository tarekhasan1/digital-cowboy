import type { Metadata } from "next";
import GlobalCTA from "@/components/GlobalCTA";

export const metadata: Metadata = {
  title: "Privacy Policy | DigitalCowboy",
  description: "How DigitalCowboy collects, uses and protects your information.",
};

export default function PrivacyPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background pt-24">
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-white/40 text-sm mb-6">Last updated: 2026</p>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-16">
            <p className="text-white/70 text-sm leading-relaxed">
              This is a standard-form template policy and hasn't yet been reviewed by a lawyer for your specific business and jurisdiction. Please have it reviewed before relying on it, especially given the personal information collected through the contact form on this site.
            </p>
          </div>

          <div className="space-y-12 text-white/60 leading-relaxed">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
              <p>
                When you submit an enquiry through our contact form or book a discovery call, we collect the information you provide, which may include your name, business/company name, email address, phone number, project details, and budget. We do not collect payment information through this site.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">2. Website Usage Data</h2>
              <p>
                We also collect aggregate, anonymised information about how visitors use this site: approximate location (country/region/city, derived from your network connection — not your precise GPS location), device type, browser, the pages you visit, and the site that referred you. We do not store your IP address or any raw device-identifying information. This data is used only to understand overall site traffic and is not linked to your name or contact details unless you separately submit a form.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
              <p>
                We use the information you provide to respond to your enquiry, confirm and manage discovery call bookings, discuss potential projects, and, where you've agreed to it, to send you occasional updates about our services. We do not sell your information to third parties.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">4. How We Store Your Information</h2>
              <p>
                Enquiry and booking details are stored securely in our systems and used only by our team to manage client relationships and respond to enquiries. We take reasonable technical and organisational measures to protect your information against unauthorised access, loss, or misuse.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">5. Third-Party Services</h2>
              <p>
                We may use third-party services (such as email delivery providers and our hosting provider) to help us communicate with you and operate this site. These providers only receive the information necessary to perform their function and are not permitted to use it for any other purpose.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights</h2>
              <p>
                You can request access to, correction of, or deletion of the personal information we hold about you at any time by contacting us at{" "}
                <a href="mailto:hello@digitalcowboy.com.au" className="text-primary hover:underline">hello@digitalcowboy.com.au</a>.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">7. Changes to This Policy</h2>
              <p>
                We may update this policy from time to time. Any changes will be posted on this page with an updated revision date.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">8. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, contact us at{" "}
                <a href="mailto:hello@digitalcowboy.com.au" className="text-primary hover:underline">hello@digitalcowboy.com.au</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <GlobalCTA />
    </main>
  );
}
