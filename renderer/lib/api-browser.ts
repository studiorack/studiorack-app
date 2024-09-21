import { configDefaults, ConfigList, PluginLicense } from '@studiorack/core';

export function getCategories(section: string) {
  if (section === 'effects') {
    return configDefaults('app', 'plugin', 'preset', 'project').pluginEffectCategories;
  }
  return configDefaults('app', 'plugin', 'preset', 'project').pluginInstrumentCategories;
}

export function getCategoriesLabels(section: string) {
  const categories: ConfigList = getCategories(section);
  // Remove in core library if not needed.
  delete categories['all'];
  return Object.keys(categories)
    .map((key: string) => {
      return {
        label: categories[key].name,
        value: key,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getLicenses() {
  return configDefaults('app', 'plugin', 'preset', 'project').licenses;
}

export function getLicensesLabels() {
  const licenses: PluginLicense[] = getLicenses();
  return licenses
    .map((license: PluginLicense) => {
      return {
        label: license.name,
        value: license.key,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getPlatforms() {
  return [
    {
      label: 'Linux',
      value: 'linux',
    },
    {
      label: 'Mac',
      value: 'mac',
    },
    {
      label: 'Windows',
      value: 'win',
    },
  ];
}

export function getPlatformsLabels() {
  return getPlatforms();
}
