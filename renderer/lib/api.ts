import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import Doc from '../types/doc';
import { PluginEntry, PluginPack, pluginsGet, PluginVersion } from '@studiorack/core';
import { ELECTRON_APP } from './utils';

const docsDirectory = ELECTRON_APP ? join(process.cwd(), 'renderer', '_docs') : join(process.cwd(), '_docs');

export function getDocSlugs() {
  return fs.readdirSync(docsDirectory);
}

export function getDocBySlug(slug: string, fields: string[]) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(docsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const items: Doc = {
    slug: '',
    content: '',
    title: '',
  };

  // Ensure only the minimal needed data is exposed
  fields.forEach(field => {
    if (field === 'slug') {
      items[field] = realSlug;
    }
    if (field === 'content') {
      items[field] = content;
    }
    if (data[field]) {
      items[field as keyof Doc] = data[field];
    }
  });

  return items;
}

export function getAllDocs(fields: string[]) {
  const slugs = getDocSlugs();
  const docs = slugs.map(slug => getDocBySlug(slug, fields));
  return docs;
}

export function getPlugin(pluginPack: PluginPack, pluginId: string) {
  const pluginEntry: PluginEntry = pluginPack[pluginId];
  const plugin: PluginVersion = pluginEntry.versions[pluginEntry.version];
  plugin.id = pluginId;
  plugin.version = pluginEntry.version;
  return plugin;
}

export async function getPlugins(section: string) {
  const pluginPack: PluginPack = await pluginsGet(section);
  const plugins: PluginVersion[] = [];
  for (const pluginId in pluginPack) {
    const plugin: PluginVersion = getPlugin(pluginPack, pluginId);
    plugins.push(plugin);
  }
  return plugins;
}
