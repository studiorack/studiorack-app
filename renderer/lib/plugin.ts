import { configDefaults } from '../../node_modules/@studiorack/core/build/config-defaults';
import {
  PluginCategory,
  PluginEntry,
  PluginLicense,
  PluginPack,
  PluginVersion,
} from '../../node_modules/@studiorack/core/build/types/plugin';

export function filterPlugins(
  category: string,
  plugins: PluginVersion[],
  pluginTypes: { [property: string]: PluginCategory },
  query: string,
): PluginVersion[] {
  console.log('filterPlugins', category, query);
  return plugins.filter((plugin: PluginVersion) => {
    const matchingTags = plugin.tags.filter(element => pluginTypes[category].tags.includes(element));
    if (
      (category === 'all' || matchingTags.length > 0) &&
      (plugin.author.toLowerCase().indexOf(query) !== -1 ||
        plugin.id?.toLowerCase().indexOf(query) !== -1 ||
        plugin.name.toLowerCase().indexOf(query) !== -1 ||
        plugin.description.toLowerCase().indexOf(query) !== -1 ||
        plugin.tags.includes(query))
    ) {
      return plugin;
    }
    return false;
  });
}

export function getPlugin(pluginPack: PluginPack, pluginId: string) {
  const pluginEntry: PluginEntry = pluginPack[pluginId];
  const plugin: PluginVersion = pluginEntry.versions[pluginEntry.version];
  plugin.id = pluginId;
  plugin.version = pluginEntry.version;
  return plugin;
}

export function pluginLicense(key: string | PluginLicense) {
  if (typeof key !== 'string') return key;
  const licenses: PluginLicense[] = configDefaults(
    'appFolder',
    'pluginFolder',
    'presetFolder',
    'projectFolder',
  ).licenses;
  let licenseMatch: PluginLicense = licenses[licenses.length - 1];
  licenses.forEach((license: PluginLicense) => {
    if (key === license.key) {
      licenseMatch = license;
      return;
    }
  });
  return licenseMatch;
}
