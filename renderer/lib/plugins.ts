import slugify from 'slugify'

const REGISTRY_PATH = process.env.REGISTRY_PATH || 'https://studiorack.github.io/studiorack-registry/'

export interface Plugin {
  author: string,
  date: string,
  description: string,
  homepage: string,
  id: string,
  path?: string,
  name: string,
  size: number,
  slug: string,
  status: string,
  tags: Array<string>,
  version: string
}

function toSlug(input: string) {
  return slugify(input ? input.replace(/\//g, '_') : input, { lower: true })
}

function fromSlug(input: string) {
  return input ? input.replace(/_/g, '/') : input
}

export async function getPlugins() {
  const res = await fetch(REGISTRY_PATH)
  return res.json().then((registry) => {
    const list = []
    for (const pluginId in registry.objects) {
      const plugin = registry.objects[pluginId]
      const version = plugin.versions[plugin.version]
      version.id = pluginId
      version.slug = toSlug(pluginId)
      version.status = 'available'
      version.version = plugin.version
      list.push(version)
    }
    return list
  })
}

export async function getAllPluginPaths() {
  const res = await fetch(REGISTRY_PATH)
  return res.json().then((registry) => {
    const list = []
    for (const pluginId in registry.objects) {
      list.push({
        params: {
          slug: toSlug(pluginId)
        }
      })
    }
    return list
  })
}

export async function getPluginData(slug: string) {
  const pluginId = fromSlug(slug)
  const res = await fetch(REGISTRY_PATH)
  return res.json().then((registry) => {
    const plugin = registry.objects[pluginId]
    if (!plugin) {
      return false;
    }
    const version = plugin.versions[plugin.version]
    version.id = pluginId
    version.slug = toSlug(pluginId)
    version.status = 'available'
    version.version = plugin.version
    return version
  })
}
