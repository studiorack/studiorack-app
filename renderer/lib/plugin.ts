import {
  ConfigList,
  PluginEntry,
  PluginFiles,
  PluginLicense,
  PluginPack,
  PluginVersion,
  pluginFileUrl,
  pathGetExt,
  pathGetWithoutExt,
} from '@studiorack/core';
import { NextRouter } from 'next/router';
import { includesValue } from './utils';
import { getLicenses } from './api-browser';

export function filterPlugins(categories: ConfigList, plugins: PluginVersion[], router: NextRouter) {
  const category = router.query['category'] as string | string[];
  // Tidy this up later on.
  let categoryTags: string[] = [];
  if (category) {
    if (typeof category === 'string') {
      categoryTags = categories[category].tags;
    } else {
      category.forEach(cat => {
        categoryTags = categoryTags.concat(categories[cat].tags);
      });
    }
  }
  const license = router.query['license'] as string | string[];
  const platform = router.query['platform'] as string | string[];
  const search: string = router.query['search'] as string;
  return plugins.filter((plugin: PluginVersion) => {
    const platformsSupported = Object.keys(plugin.files);
    if (category && !includesValue(categoryTags, plugin.tags)) return false;
    if (license && !includesValue(license, typeof plugin.license === 'object' ? plugin.license.key : plugin.license))
      return false;
    if (platform && !includesValue(platform, platformsSupported)) return false;
    if (
      search &&
      plugin.id?.toLowerCase().indexOf(search.toLowerCase()) === -1 &&
      plugin.name?.toLowerCase().indexOf(search.toLowerCase()) === -1 &&
      plugin.description?.toLowerCase().indexOf(search.toLowerCase()) === -1 &&
      plugin.tags?.indexOf(search.toLowerCase()) === -1
    )
      return false;
    return plugin;
  });
}

export function getPlugin(pluginPack: PluginPack, pluginId: string) {
  const pluginEntry: PluginEntry = pluginPack[pluginId];
  const plugin: PluginVersion = pluginEntry.versions[pluginEntry.version];
  plugin.id = pluginId;
  plugin.version = pluginEntry.version;
  return plugin;
}

export function pluginFileUrlCompressed(plugin: PluginVersion, type: keyof PluginFiles) {
  const fileUrl: string = pluginFileUrl(plugin, type);
  const fileWithoutExt: string = pathGetWithoutExt(fileUrl);
  const fileExt: string = pathGetExt(fileUrl);
  return `${fileWithoutExt}-compact.${fileExt}`;
}

export function pluginLicense(key: string | PluginLicense) {
  if (typeof key !== 'string') return key;
  const licenses: PluginLicense[] = getLicenses();
  let licenseMatch: PluginLicense = licenses[licenses.length - 1];
  licenses.forEach((license: PluginLicense) => {
    if (key === license.key) {
      licenseMatch = license;
      return;
    }
  });
  return licenseMatch;
}
