import { useRouter } from 'next/router';

export function getBasePath() {
  return useRouter().basePath;
}

export function getCrumbUrl(items: string[], itemToMatch: string) {
  let url: string = '';
  for (const item of items) {
    url += '/' + item;
    if (item === itemToMatch) break;
  }
  return url;
}

export function isSelected(path: string) {
  if (path === '/') {
    return useRouter().asPath === path ? 'active' : '';
  }
  return useRouter().asPath.startsWith(path) ? 'active' : '';
}
