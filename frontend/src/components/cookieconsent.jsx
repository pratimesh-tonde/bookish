import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { initAnalytics } from "../utils/analytics";

const CONSENT_KEY = "cookie-consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY);
    if (saved === "accepted") {
      initAnalytics();
    } else if (!saved) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    initAnalytics();
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-line bg-white p-4 shadow-lg">
      <div className="page-container flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-slate">
          We use cookies to keep you logged in and, with your consent, to understand how the site is
          used. Read our{" "}
          <Link to="/privacy" className="text-maroon hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button onClick={handleDecline} className="btn-secondary !px-4 !py-2 text-sm">
            Decline
          </button>
          <button onClick={handleAccept} className="btn-primary !px-4 !py-2 text-sm">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;