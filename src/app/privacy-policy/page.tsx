import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for our Instagram automation tools.',
  robots: 'index,follow',
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-2">
    <h2 className="text-lg font-semibold text-white">{title}</h2>
    <div className="prose prose-invert max-w-none text-white/80">{children}</div>
  </section>
);

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#12111A]">
      <div className="mx-auto max-w-3xl px-6 py-12 space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
          <p className="text-sm text-white/60">Last updated: {new Date().toISOString().slice(0, 10)}</p>
        </header>

        <Section title="Overview">
          <p>
            This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you use our
            Instagram automation tools and related services (the “Services”). By using the Services, you agree to this
            Policy. If you do not agree, please do not use the Services.
          </p>
        </Section>

        <Section title="Information We Collect">
          <ul>
            <li>
              <strong>Account & Authentication</strong>: Instagram professional account identifiers, OAuth authorization
              codes, access tokens, token metadata (creation/expiry), and granted permissions/scope.
            </li>
            <li>
              <strong>Usage Data</strong>: API requests/responses, webhook events (e.g., comments), job/worker logs, and
              diagnostic information (timestamps, response codes).
            </li>
            <li>
              <strong>Technical Data</strong>: Browser type, device, IP address (for security and fraud prevention), and
              basic analytics.
            </li>
          </ul>
        </Section>

        <Section title="How We Use Information">
          <ul>
            <li>Authenticate your Instagram professional account and maintain your session.</li>
            <li>Process automations (e.g., comment replies, private replies/DMs) based on your configured rules.</li>
            <li>Operate webhooks and background workers; improve reliability and performance.</li>
            <li>Provide support, troubleshoot issues, secure our Services, and comply with legal obligations.</li>
          </ul>
        </Section>

        <Section title="Cookies & Similar Technologies">
          <p>
            We may use cookies or local storage to remember preferences (e.g., selected Instagram user ID) and manage
            sessions. You can control cookies via your browser settings; the Services may not function correctly without
            them.
          </p>
        </Section>

        <Section title="Data Sharing & Disclosure">
          <ul>
            <li>
              <strong>Service Providers</strong>: Hosting, databases, and queue infrastructure to operate the Services.
            </li>
            <li>
              <strong>Compliance & Safety</strong>: To comply with law, enforce our terms, or protect rights, property, and safety.
            </li>
            <li>
              <strong>No Sale of Personal Information</strong>: We do not sell personal information.
            </li>
          </ul>
        </Section>

        <Section title="Data Retention">
          <p>
            We retain information for as long as necessary to provide the Services, meet legal obligations, resolve
            disputes, and enforce agreements. You may request deletion subject to applicable laws and technical limits.
          </p>
        </Section>

        <Section title="Security">
          <p>
            We implement reasonable technical and organizational measures to protect information. No method of
            transmission or storage is 100% secure; we cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="Children’s Privacy">
          <p>
            The Services are not directed to children under the age required by applicable law. We do not knowingly
            collect data from such children.
          </p>
        </Section>

        <Section title="International Transfers">
          <p>
            Your information may be processed and stored in jurisdictions with different data protection laws than your
            own. We take steps to ensure appropriate safeguards are in place for such transfers.
          </p>
        </Section>

        <Section title="Your Rights">
          <p>
            Depending on your jurisdiction, you may have rights to access, correct, delete, or port your data, and to
            object to or restrict certain processing. Contact us to exercise these rights.
          </p>
        </Section>

        <Section title="Third-Party Platforms (Meta/Instagram)">
          <p>
            Our Services interact with Meta’s Instagram Platform APIs and Webhooks. Your use of Instagram is governed by
            Meta’s terms and policies. We use permissions and data solely to operate the features you enable (e.g.,
            comment moderation, private replies). See Meta’s documentation for details.
          </p>
        </Section>

        <Section title="Changes to This Policy">
          <p>
            We may update this Policy from time to time. Material changes will be indicated by updating the “Last
            updated” date or by additional notice where required.
          </p>
        </Section>

        <Section title="Contact Us">
          <p>
            Questions or requests regarding this Policy can be sent to:{" "}
            <a href="mailto:support@yourdomain.com" className="text-violet-400 underline">
              support@sociact.ai
            </a>
            .
          </p>
        </Section>
      </div>
    </main>
  );
}