import { NextRouter } from 'next/router';
import {
  Architecture,
  FileInterface,
  packageCompatibleFiles,
  PackageInterface,
  PackageVersion,
  pluginCategoryInstruments,
  PluginCategoryOption,
  RegistryPackages,
  SystemType,
} from '@open-audio-stack/core';

export function packageCompatibleFilesMatch(pkg: PackageVersion, archList: Architecture[], sysList: SystemType[]) {
  return pkg.files.filter((file: FileInterface) => {
    const archMatches = file.architectures.filter(architecture => {
      return archList.includes(architecture);
    });
    const sysMatches = file.systems.filter(system => {
      return sysList.includes(system.type);
    });
    return archMatches.length && sysMatches.length;
  });
}

export function getParam(router: NextRouter, field: string) {
  return typeof router.query[field] === 'string' ? [router.query[field]] : router.query[field];
}

export function filterPlugins(router: NextRouter, packages: RegistryPackages) {
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
