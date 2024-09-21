import styles from '../styles/components/download.module.css';
import { pluginFileUrl, PluginVersion } from '@studiorack/core';
import { getBasePath } from '../lib/path';
// import { pluginFileUrlCompressed } from '../lib/plugin';

type DownloadsProps = {
  plugin: PluginVersion;
};

const Downloads = ({ plugin }: DownloadsProps) => (
  <div className={`${styles.download}`}>
    <p>Download and install manually:</p>
    {plugin.tags.includes('sfz') || plugin.tags.includes('sf2') ? (
      <span>
        <a className={`button ${styles.downloadButton}`} href={pluginFileUrl(plugin, 'linux')} title="High-quality">
          High-quality
          <img
            className={styles.downloadButtonIcon}
            src={`${getBasePath()}/images/icon-download.svg`}
            alt="Download"
            loading="lazy"
          />
        </a>
        {/* <a className={`button ${styles.downloadButton}`} href={pluginFileUrlCompressed(plugin, 'linux')} title="Compressed">
          Compressed
          <img
            className={styles.downloadButtonIcon}
            src={`${getBasePath()}/images/icon-download.svg`}
            alt="Download"
            loading="lazy"
          />
        </a> */}
      </span>
    ) : (
      <span>
        {plugin.files.linux ? (
          <a className={`button ${styles.downloadButton}`} href={pluginFileUrl(plugin, 'linux')} title="Linux x64">
            Linux
            <img
              className={styles.downloadButtonIcon}
              src={`${getBasePath()}/images/icon-download.svg`}
              alt="Download"
              loading="lazy"
            />
          </a>
        ) : (
          ''
        )}
        {plugin.files.mac ? (
          <a className={`button ${styles.downloadButton}`} href={pluginFileUrl(plugin, 'mac')} title="MacOS x64">
            MacOS
            <img
              className={styles.downloadButtonIcon}
              src={`${getBasePath()}/images/icon-download.svg`}
              alt="Download"
              loading="lazy"
            />
          </a>
        ) : (
          ''
        )}
        {plugin.files.win ? (
          <a className={`button ${styles.downloadButton}`} href={pluginFileUrl(plugin, 'win')} title="Windows x64">
            Windows
            <img
              className={styles.downloadButtonIcon}
              src={`${getBasePath()}/images/icon-download.svg`}
              alt="Download"
              loading="lazy"
            />
          </a>
        ) : (
          ''
        )}
      </span>
    )}
  </div>
);

export default Downloads;
