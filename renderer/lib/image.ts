import { SyntheticEvent } from 'react';
import { getBasePath } from '../lib/path';

export function imageError(event: SyntheticEvent) {
  const el = event.target as HTMLImageElement;
  const fallback = `${getBasePath()}/images/plugin.png`;
  if (el.getAttribute('src') !== fallback) {
    el.setAttribute('src', fallback);
  }
  return undefined;
}
