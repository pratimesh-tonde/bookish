import useDocumentTitle from "../hooks/useDocumentTitle";

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="mb-2 font-serif text-xl font-semibold text-ink">{title}</h2>
    <div className="space-y-3 text-sm leading-relaxed text-slate">{children}</div>
  </div>
);

const PrivacyPolicy = () => {
  useDocumentTitle("Privacy Policy");
  return (
  <div className="page-container max-w-3xl py-10">
    <h1 className="section-title mb-2">Privacy Policy</h1>
    <p className="mb-8 text-sm text-slate">Last updated: [15 sep 2026]</p>

    <div className="mb-8 rounded-sm border border-gold/40 bg-gold/10 p-4 text-sm text-ink">
      <strong>Notice:</strong> Keep safe your login details and don't share you otp and passcode.
    </div>

    <Section title="1. Who we are">
      <p>
        Bookish ("we", "us", "our") operates this website. If you have questions about this policy,
        contact us at [support@bookportal.com].
      </p>
    </Section>

    <Section title="2. Information we collect">
      <p>When you use Bookish, we may collect:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Account details: name, email address, and password (or your Google account ID if you sign in with Google)</li>
        <li>Order details: shipping address, phone number, and order history</li>
        <li>Payment information: handled directly by our payment processor (Razorpay) — we do not store your card details</li>
        <li>Usage data: pages visited and general site interactions, if analytics is enabled</li>
        <li>Cookies: see our Cookie Policy section below</li>
      </ul>
    </Section>

    <Section title="3. How we use your information">
      <ul className="list-disc space-y-1 pl-5">
        <li>To create and manage your account</li>
        <li>To process and deliver your orders</li>
        <li>To respond to your support requests</li>
        <li>To improve the site based on aggregate usage patterns</li>
        <li>To send order-related communication (and, only with your consent, marketing updates)</li>
      </ul>
    </Section>

    <Section title="4. Third-party services">
      <p>We share the minimum necessary data with these providers to run the site:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li><strong>Google Sign-In</strong> — if you choose to log in with Google</li>
        <li><strong>Razorpay</strong> — to process payments</li>
        <li><strong>MongoDB Atlas / our hosting provider</strong> — to store data securely</li>
        <li><strong>Analytics provider</strong> (e.g. Google Analytics) — only after you accept our cookie banner</li>
      </ul>
    </Section>

    <Section title="5. Cookies">
      <p>
        We use essential cookies/local storage to keep you logged in and remember your cart. With your
        consent (via our cookie banner), we also use analytics cookies to understand how the site is
        used. You can withdraw consent at any time by clearing your browser's site data.
      </p>
    </Section>

    <Section title="6. Your rights">
      <p>
        You can access, update, or delete your account information at any time from your Profile page,
        or by contacting us at [support@bookportal.com]. Depending on your location, you may have
        additional rights under laws such as the GDPR or India's DPDP Act.
      </p>
    </Section>

    <Section title="7. Data retention">
      <p>
        We keep your account and order data for as long as your account is active, or as needed to
        comply with legal obligations (such as tax records).
      </p>
    </Section>

    <Section title="8. Changes to this policy">
      <p>
        We may update this policy from time to time. We'll update the "Last updated" date above when we
        do.
      </p>
    </Section>
  </div>
  );
};

export default PrivacyPolicy;