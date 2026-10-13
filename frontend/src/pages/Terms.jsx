import useDocumentTitle from "../hooks/useDocumentTitle";

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="mb-2 font-serif text-xl font-semibold text-ink">{title}</h2>
    <div className="space-y-3 text-sm leading-relaxed text-slate">{children}</div>
  </div>
);

const Terms = () => {
  useDocumentTitle("Terms & Conditions");
  return (
  <div className="page-container max-w-3xl py-10">
    <h1 className="section-title mb-2">Terms &amp; Conditions</h1>
    <p className="mb-8 text-sm text-slate">Last updated: [18 sep 2026]</p>

    <div className="mb-8 rounded-sm border border-gold/40 bg-gold/10 p-4 text-sm text-ink">
      <strong>Notice:</strong> Keep your login details safe and don't share otp and passcode.
    </div>

    <Section title="1. Acceptance of terms">
      <p>
        By creating an account or placing an order on Bookish, you agree to these Terms &amp;
        Conditions. If you don't agree, please don't use the site.
      </p>
    </Section>

    <Section title="2. Accounts">
      <p>
        You're responsible for keeping your login details secure and for all activity under your
        account. Let us know immediately at [support@bookish.com] if you suspect unauthorised access.
      </p>
    </Section>

    <Section title="3. Orders and pricing">
      <ul className="list-disc space-y-1 pl-5">
        <li>All prices are listed in INR (₹) and include applicable taxes unless stated otherwise.</li>
        <li>We reserve the right to cancel an order if a book is out of stock or mispriced due to an error.</li>
        <li>An order is confirmed once payment is successfully processed (or, for Cash on Delivery, once placed).</li>
      </ul>
    </Section>

    <Section title="4. Shipping and delivery">
      <p>
        Estimated delivery times are shown at checkout and are not guaranteed. Delays caused by
        courier partners or circumstances outside our control are not our responsibility, though
        we'll do our best to help resolve issues.
      </p>
    </Section>

    <Section title="5. Returns and refunds">
      <p>
        [Describe your actual return window here, e.g. "Books can be returned within 7 days of
        delivery if unused and in original condition."] Refunds are issued to the original payment
        method within [X] business days of us receiving the returned item.
      </p>
    </Section>

    <Section title="6. Prohibited use">
      <p>You agree not to misuse the site — for example, by attempting to breach security, submitting fraudulent orders, or scraping content without permission.</p>
    </Section>

    <Section title="7. Limitation of liability">
      <p>
        Bookish is provided "as is." To the extent permitted by law, we are not liable for indirect or
        incidental damages arising from your use of the site.
      </p>
    </Section>

    <Section title="8. Governing law">
      <p>These terms are governed by the laws of [india/maharastra], and any disputes will be handled in the courts of [high court of mumbai].</p>
    </Section>

    <Section title="9. Changes to these terms">
      <p>We may revise these terms occasionally. Continued use of the site after changes means you accept the updated terms.</p>
    </Section>

    <Section title="10. Contact">
      <p>Questions about these terms? Reach us at [support@bookish.com].</p>
    </Section>
  </div>
  );
};

export default Terms;