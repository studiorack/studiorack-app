import slugify from 'slugify';
import { siteTitle } from '../components/layout';
import { PluginVersion, PluginVersionLocal } from '@studiorack/core';

export const ELECTRON_APP: boolean = true;

export function pageTitle(items: string[]) {
  return (
    siteTitle +
    items
      .map((item: string) => {
        return ` | ${item}`;
      })
      .join('')
  );
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function includesValue(items: string | string[] | undefined, values: string | string[] | undefined) {
  if (!items || !values) return false;
  if (typeof items === 'string') {
    if (typeof values === 'string') return items === toSlug(values);
    // os platform contains array of nested objects
    return values.some((val: any) => {
      if (typeof val === 'string') return val.toLowerCase() === items.toLowerCase();
      else return val.name.toLowerCase() === items.toLowerCase();
    });
  } else if (typeof items === 'object') {
    if (typeof values === 'string') return items.includes(toSlug(values));
    // os platform contains array of nested objects
    return items.some((item: string) => {
      return values.some((val: any) => {
        if (typeof val === 'string') return val.toLowerCase() === item.toLowerCase();
        else return val.name.toLowerCase() === item.toLowerCase();
      });
    });
  }
}

export function pluginGetOrgId(plugin: PluginVersion | PluginVersionLocal) {
  return plugin.id?.split('/')[0] || '';
}

export function pluginGetPluginId(plugin: PluginVersion | PluginVersionLocal) {
  return plugin.id?.split('/')[1] || '';
}

export function timeSince(date: string) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 2) {
    return Math.floor(interval) + ' years';
  }
  if (interval > 1) {
    return Math.floor(interval) + ' year';
  }
  interval = seconds / 2592000;
  if (interval > 2) {
    return Math.floor(interval) + ' months';
  }
  if (interval > 1) {
    return Math.floor(interval) + ' month';
  }
  interval = seconds / 86400;
  if (interval > 2) {
    return Math.floor(interval) + ' days';
  }
  if (interval > 1) {
    return Math.floor(interval) + ' day';
  }
  interval = seconds / 3600;
  if (interval > 2) {
    return Math.floor(interval) + ' hours';
  }
  if (interval > 1) {
    return Math.floor(interval) + ' hour';
  }
  interval = seconds / 60;
  if (interval > 2) {
    return Math.floor(interval) + ' minutes';
  }
  if (interval > 1) {
    return Math.floor(interval) + ' minute';
  }
  return Math.floor(seconds) + ' seconds';
}

export function toSlug(input: string) {
  return slugify(input || '', {
    lower: true,
  });
}
