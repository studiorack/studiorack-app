import styles from '../styles/components/download.module.css';
import { getBasePath } from '../lib/path';
import { PackageFile, PackageFileMap, pathGetExt, systemTypes } from '@open-audio-stack/core';

type DownloadsProps = {
  downloads: PackageFileMap;
};

const Downloads = ({ downloads }: DownloadsProps) => (
  <div className={`${styles.download}`}>
    <p>Download and install manually:</p>
    {Object.keys(downloads).map((system: string) => (
      <div className={styles.downloadSystem}>
        <div className={`${styles.downloadSystemName} ${styles['icon-' + system]}`}>
          {systemTypes.filter(systemType => systemType.value === system)[0].name}
        </div>
        <div className={styles.downloadFiles}>
          {downloads[system].map((file: PackageFile) => (
            <div className={styles.downloadFile}>
              <span className={styles.downloadSystemArch}>{file.architectures.join(', ')}</span>
              <a className={`button ${styles.downloadButton}`} href={file.url} title="Download">
                .{pathGetExt(file.url)}
                <img
                  className={styles.downloadButtonIcon}
                  src={`${getBasePath()}/images/icon-download.svg`}
                  alt="Download"
                  loading="lazy"
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default Downloads;
