import styles from '../styles/components/details.module.css';
import { getBasePath } from '../lib/path';
import Crumb from './crumb';
import { timeSince } from '../lib/utils';
import Audio from './audio';
import Player from './player';
import Dependency from './dependency';
import Downloads from './download';
import Code from './code';
import Installer from './installer';
import { licenses, PackageFileMap, PackageInterface, PackageVersion, RegistryType } from '@open-audio-stack/core';

type DetailsProps = {
  downloads: PackageFileMap;
  pkg: PackageInterface;
  pkgVersion: PackageVersion;
  type: RegistryType;
};

const Details = ({ downloads, pkg, pkgVersion, type }: DetailsProps) => (
  <article>
    <div className={styles.header}>
      <div className={styles.headerInner2}>
        <Crumb items={[type, pkg.slug.split('/')[0], pkg.slug.split('/')[1]]}></Crumb>
      </div>
      <div className={styles.headerInner}>
        <div className={styles.media}>
          <div className={styles.imageContainer}>
            {pkgVersion.audio ? <Audio file={pkgVersion.audio} /> : ''}
            {pkgVersion.tags.includes('sfz') ? <Player plugin={pkgVersion} /> : ''}
            {pkgVersion.image ? (
              <img className={styles.image} src={pkgVersion.image} alt={pkgVersion.name || ''} />
            ) : (
              ''
            )}
          </div>
        </div>
        <div className={styles.details}>
          <h3 className={styles.title}>
            {pkgVersion.name || ''} <span className={styles.version}>v{pkg.version}</span>
          </h3>
          <p className={styles.author}>
            By{' '}
            <a href={pkgVersion.url} target="_blank">
              {pkgVersion.author}
            </a>
          </p>
          <p>
            {pkgVersion.description}
            <Dependency plugin={pkgVersion} />
          </p>
          <div className={styles.metadataList}>
            {/* <div className={styles.metadata}><img className={styles.icon} src={`${getBasePath()}/images/icon-filesize.svg`} alt="Filesize" loading="lazy" /> {formatBytes(plugin.files.linux.size)}</div> */}
            <div className={styles.metadata}>
              <img
                className={styles.icon}
                src={`${getBasePath()}/images/icon-date.svg`}
                alt="Date updated"
                loading="lazy"
              />{' '}
              {timeSince(pkgVersion.date)} ago
            </div>
            <div className={styles.metadata}>
              <img
                className={styles.icon}
                src={`${getBasePath()}/images/icon-license.svg`}
                alt="License"
                loading="lazy"
              />{' '}
              {pkgVersion.license ? (
                <a href={`https://choosealicense.com/licenses/${pkgVersion.license}`} target="_blank">
                  {licenses.filter(license => pkgVersion.license === license.value)[0].name}
                </a>
              ) : (
                'none'
              )}
            </div>
            <div className={styles.metadata}>
              <img className={styles.icon} src={`${getBasePath()}/images/icon-tag.svg`} alt="Tags" loading="lazy" />
              <ul className={styles.tags}>
                {pkgVersion.tags.map((tag: string, tagIndex: number) => (
                  <li className={styles.tag} key={`${tag}-${tagIndex}`}>
                    {tag}
                    {tagIndex !== pkgVersion.tags.length - 1 ? ',' : ''}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.metadataFooter}>
              <Installer pkg={pkg} pkgVersion={pkgVersion} />
              <a href={pkgVersion.url} target="_blank">
                <button className="button button-clear">View source</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="sfzPlayer"></div>
    <div className={styles.options}>
      <div className={styles.row}>
        <Downloads downloads={downloads} />
        <Code pkg={pkg} pkgVersion={pkgVersion} />
      </div>
    </div>
  </article>
);

export default Details;
