declare global {
  interface Window {
    gtag: any;
  }
}

interface AnalyticsProps {
  action: string;
  category: string;
  label: string;
  value: string;
}

export const GA_TRACKING_ID = 'G-70BC3S1DBZ';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: AnalyticsProps) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
};
