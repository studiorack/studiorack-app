import { useRouter } from 'next/router';

function getBasePath() {
  return useRouter().basePath;
}

function getCrumbUrl(items: string[], itemToMatch: string) {
  let url: string = '';
  for (const item of items) {
    url += '/' + item;
    if (item === itemToMatch) break;
  }
  return url;
}

function isSelected(path: string) {
  if (path === '/') {
    return useRouter().asPath === path ? 'active' : '';
  }
  return useRouter().asPath.startsWith(path) ? 'active' : '';
}

export { getBasePath, getCrumbUrl, isSelected };
