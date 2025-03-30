import { NextRouter } from 'next/router';
import {
  Architecture,
  packageCompatibleFiles,
  PackageInterface,
  PackageVersion,
  pluginCategoryInstruments,
  PluginCategoryOption,
  RegistryPackages,
  SystemType,
} from '@open-audio-stack/core';
import { getParam } from './plugin';

export function filterPresets(router: NextRouter, packages: RegistryPackages) {
  const type = getParam(router, 'type');
  const category = getParam(router, 'category');
  let categoryTags: string[] = [];
  if (category) {
    category.forEach(cat => {
      let catOption: PluginCategoryOption | undefined;
      pluginCategoryInstruments.forEach(pluginCategoryInstrument => {
        if (pluginCategoryInstrument.value === cat) catOption = pluginCategoryInstrument;
      });
      if (catOption) categoryTags = categoryTags.concat(catOption.tags.map(tag => tag.toLowerCase()));
    });
  }
  const license = getParam(router, 'license');
  const system = getParam(router, 'system');
  const search = getParam(router, 'search');
  const packagesFiltered: PackageInterface[] = [];
  for (const slug in packages) {
    const pkg: PackageInterface = packages[slug];
    const pkgVersion: PackageVersion | undefined = pkg.versions[pkg.version];
    if (pkgVersion) {
      const tagsLower: string[] = pkgVersion.tags.map(tag => tag.toLowerCase());
      if (type && !type.includes(pkgVersion.type)) continue;
      if (category && categoryTags.filter(categoryTag => tagsLower.includes(categoryTag)).length === 0) continue;
      if (license && !license.includes(pkgVersion.license)) continue;
      if (system && packageCompatibleFiles(pkgVersion, [Architecture.X64], system as SystemType[]).length === 0)
        continue;
      if (
        search &&
        pkg.slug.toLowerCase().indexOf(search[0].toLowerCase()) === -1 &&
        pkgVersion.name.toLowerCase().indexOf(search[0].toLowerCase()) === -1 &&
        pkgVersion.description.toLowerCase().indexOf(search[0].toLowerCase()) === -1 &&
        pkgVersion.tags.indexOf(search[0].toLowerCase()) === -1
      )
        continue;
      packagesFiltered.push(pkg);
    }
  }
  return packagesFiltered.sort((a: PackageInterface, b: PackageInterface) => {
    return a.versions[a.version].name.localeCompare(b.versions[b.version].name);
  });
}
