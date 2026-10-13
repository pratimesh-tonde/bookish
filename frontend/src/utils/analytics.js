// Loads Google Analytics (GA4) — but only when called, which we only do
// after the person accepts the cookie banner. Never imported/loaded eagerly.
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let initialized = false;

export const initAnalytics = () => {
  if (initialized || !GA_ID) return;
  initialized = true;

  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_ID);
};

// Call this after route changes if you want per-page pageview tracking.
export const trackPageview = (path) => {
  if (window.gtag && GA_ID) {
    window.gtag("event", "page_view", { page_path: path });
  }
};