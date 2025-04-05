import { ConfigInterface, ConfigLocal, isTests, ManagerLocal, RegistryType } from '@open-audio-stack/core';
import path from 'path';

export const CONFIG: ConfigInterface = {
  registries: [
    {
      name: 'Open Audio Registry',
      url: 'https://open-audio-stack.github.io/open-audio-stack-registry',
    },
  ],
  version: '1.0.0',
};

export const CONFIG_LOCAL_TEST: ConfigInterface = {
  ...CONFIG,
  appDir: 'test',
  pluginsDir: path.join('test', 'installed', 'plugins'),
  presetsDir: path.join('test', 'installed', 'presets'),
  projectsDir: path.join('test', 'installed', 'projects'),
};

export const config: ConfigLocal = new ConfigLocal(isTests() ? CONFIG_LOCAL_TEST : undefined);
config.logEnable();
console.log('appDir', config.get('appDir'));
console.log('pluginsDir', config.get('pluginsDir'));
console.log('presetsDir', config.get('presetsDir'));
console.log('projectsDir', config.get('projectsDir'));

export const managers: Record<string, ManagerLocal> = {};
const types = [RegistryType.Plugins, RegistryType.Presets, RegistryType.Projects];
for (const type of types) {
  const manager: ManagerLocal = new ManagerLocal(type as RegistryType, isTests() ? CONFIG_LOCAL_TEST : undefined);
  manager.logEnable();
  await manager.sync();
  manager.scan();
  managers[type] = manager;
}
