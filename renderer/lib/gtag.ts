import { ELECTRON_APP } from './utils';

/* eslint-disable  @typescript-eslint/no-explicit-any */
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

export const GA_TRACKING_ID = ELECTRON_APP ? 'G-70BC3S1DBZ' : 'G-8XFFV4K2XH';

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
