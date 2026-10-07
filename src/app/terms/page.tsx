import type { Metadata } from "next";
import GlobalCTA from "@/components/GlobalCTA";

export const metadata: Metadata = {
  title: "Terms of Service | DigitalCowboy",
  description: "The terms that govern your use of the DigitalCowboy website and services.",
};

export default function TermsPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background pt-24">
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-white/40 text-sm mb-6">Last updated: 2026</p>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-16">
            <p className="text-white/70 text-sm leading-relaxed">
              This is a standard-form template and hasn't yet been reviewed by a lawyer for your specific business and jurisdiction. Please have it reviewed before relying on it. Project-specific terms (scope, pricing, payment schedules, deliverables) are agreed separately with each client and take precedence over this page.
            </p>
          </div>

          <div className="space-y-12 text-white/60 leading-relaxed">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">1. Use of This Website</h2>
              <p>
                This website is provided by DigitalCowboy to share information about our services and to allow prospective clients to contact us. By using this site, you agree to use it only for lawful purposes.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">2. Intellectual Property</h2>
              <p>
                All content on this website, including text, graphics, logos, and design, is the property of DigitalCowboy unless otherwise stated, and may not be reproduced without prior written permission.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">3. Enquiries &amp; Project Work</h2>
              <p>
                Submitting an enquiry through this website does not create a binding contract for services. Any project work is governed by a separate agreement (proposal, quote, or contract) entered into directly between DigitalCowboy and the client, which will set out scope, pricing, timelines, and payment terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">4. No Warranty</h2>
              <p>
                This website and its content are provided "as is" without warranties of any kind, express or implied, regarding accuracy, completeness, or fitness for a particular purpose.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
              <p>
                To the extent permitted by law, DigitalCowboy is not liable for any indirect, incidental, or consequential loss arising from your use of this website.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">6. Changes to These Terms</h2>
              <p>
                We may update these terms from time to time. Continued use of the website after changes are posted constitutes acceptance of the updated terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">7. Contact Us</h2>
              <p>
                If you have any questions about these Terms of Service, contact us at{" "}
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
