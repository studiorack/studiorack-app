import styles from '../styles/plugin.module.css';
import { PluginVersion } from '@studiorack/core';
import { pluginFileUrl, pathGetExt, pathGetWithoutExt } from '../../node_modules/@studiorack/core/build/utils';
import { getBasePath } from '../lib/path';

type DownloadsProps = {
  plugin: PluginVersion;
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
          <img
            className={styles.pluginButtonIcon}
            src={`${getBasePath()}/images/icon-download.svg`}
            alt="Download"
            loading="lazy"
          />
        </a>
        <a className={`button ${styles.button}`} href={pluginFileUrlCompressed(plugin, 'linux')} title="Compressed">
          Compressed
          <img
            className={styles.pluginButtonIcon}
            src={`${getBasePath()}/images/icon-download.svg`}
            alt="Download"
            loading="lazy"
          />
        </a>
      </span>
    );
  } else {
    return (
      <span>
        {plugin.files.linux ? (
          <a className={`button ${styles.button}`} href={pluginFileUrl(plugin, 'linux')} title="Linux x64">
            Linux
            <img
              className={styles.pluginButtonIcon}
              src={`${getBasePath()}/images/icon-download.svg`}
              alt="Download"
              loading="lazy"
            />
          </a>
        ) : (
          ''
        )}
        {plugin.files.mac ? (
          <a className={`button ${styles.button}`} href={pluginFileUrl(plugin, 'mac')} title="MacOS x64">
            MacOS
            <img
              className={styles.pluginButtonIcon}
              src={`${getBasePath()}/images/icon-download.svg`}
              alt="Download"
              loading="lazy"
            />
          </a>
        ) : (
          ''
        )}
        {plugin.files.win ? (
          <a className={`button ${styles.button}`} href={pluginFileUrl(plugin, 'win')} title="Windows x64">
            Windows
            <img
              className={styles.pluginButtonIcon}
              src={`${getBasePath()}/images/icon-download.svg`}
              alt="Download"
              loading="lazy"
            />
          </a>
        ) : (
          ''
        )}
      </span>
    );
  }
};

export default Downloads;
