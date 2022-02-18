import { SyntheticEvent } from 'react';

export function imageError(event: SyntheticEvent) {
  const el = event.target as HTMLImageElement;
  const fallback = `/images/plugin.png`;
  if (el.getAttribute('src') !== fallback) {
    el.setAttribute('src', fallback);
  }
  return undefined;
}
