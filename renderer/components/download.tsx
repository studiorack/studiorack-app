import styles from '../styles/plugin.module.css';
import { PluginInterface } from '@studiorack/core';
import { pluginFileUrl, pathGetExt, pathGetWithoutExt } from '@studiorack/core/dist/utils';

type DownloadsProps = {
  plugin: PluginInterface;
};

function pluginFileUrlCompressed(plugin: any, platform: any) {
  const fileUrl: string = pluginFileUrl(plugin, platform);
  const fileWithoutExt: string = pathGetWithoutExt(fileUrl);
  const fileExt: string = pathGetExt(fileUrl);
  return `${fileWithoutExt}-compact.${fileExt}`;
}

const Downloads = ({ plugin }: DownloadsProps) => {
  if (plugin.tags.includes('sfz') || plugin.tags.includes('sf2')) {
    return (
      <span>
        <a className={`button ${styles.button}`} href={pluginFileUrl(plugin, 'linux')} title="High-quality">
          High-quality
        </a>
        <a className={`button ${styles.button}`} href={pluginFileUrlCompressed(plugin, 'linux')} title="Compressed">
          Compressed
        </a>
      </span>
    );
  } else {
    return (
      <span>
        {plugin.files.linux ? (
          <a className={`button ${styles.button}`} href={pluginFileUrl(plugin, 'linux')} title="Linux x64">
            Linux
          </a>
        ) : (
          ''
        )}
        {plugin.files.mac ? (
          <a className={`button ${styles.button}`} href={pluginFileUrl(plugin, 'mac')} title="MacOS x64">
            MacOS
          </a>
        ) : (
          ''
        )}
        {plugin.files.win ? (
          <a className={`button ${styles.button}`} href={pluginFileUrl(plugin, 'win')} title="Windows x64">
            Windows
          </a>
        ) : (
          ''
        )}
      </span>
    );
  }
};

export default Downloads;
