import styles from '../styles/components/details.module.css';
import { getBasePath } from '../lib/path';
import Crumb from './crumb';
import { pluginGetOrgId, pluginGetPluginId, timeSince } from '../lib/utils';
import { pluginFileUrl, PluginVersion, PluginVersionLocal } from '@studiorack/core';
import Audio from './audio';
import Player from './player';
import Dependency from './dependency';
import Downloads from './download';
import Code from './code';
import { pluginLicense } from '../lib/plugin';

type DetailsProps = {
  plugin: PluginVersion | PluginVersionLocal;
  type: string;
};

const Details = ({ plugin, type }: DetailsProps) => (
  <article>
    <div className={styles.header}>
      <div className={styles.headerInner2}>
        <Crumb items={[type, pluginGetOrgId(plugin), pluginGetPluginId(plugin)]}></Crumb>
      </div>
      <div className={styles.headerInner}>
        <div className={styles.media}>
          <div className={styles.imageContainer}>
            {plugin.files.audio ? <Audio file={plugin.files.audio} /> : ''}
            {plugin.tags.includes('sfz') ? <Player plugin={plugin} /> : ''}
            {plugin.files.image ? (
              <img className={styles.image} src={pluginFileUrl(plugin, 'image')} alt={plugin.name || ''} />
            ) : (
              ''
            )}
          </div>
        </div>
        <div className={styles.details}>
          <h3 className={styles.title}>
            {plugin.name || ''} <span className={styles.version}>v{plugin.version}</span>
          </h3>
          <p className={styles.author}>
            By{' '}
            <a href={plugin.homepage} target="_blank">
              {plugin.author}
            </a>
          </p>
          <p>
            {plugin.description}
            <Dependency plugin={plugin} />
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
              {timeSince(plugin.date)} ago
            </div>
            <div className={styles.metadata}>
              <img
                className={styles.icon}
                src={`${getBasePath()}/images/icon-license.svg`}
                alt="License"
                loading="lazy"
              />{' '}
              {plugin.license ? (
                <a href={pluginLicense(plugin.license).url} target="_blank">
                  {pluginLicense(plugin.license).name}
                </a>
              ) : (
                'none'
              )}
            </div>
            <div className={styles.metadata}>
              <img className={styles.icon} src={`${getBasePath()}/images/icon-tag.svg`} alt="Tags" loading="lazy" />
              <ul className={styles.tags}>
                {plugin.tags.map((tag: string, tagIndex: number) => (
                  <li className={styles.tag} key={`${tag}-${tagIndex}`}>
                    {tag}
                    {tagIndex !== plugin.tags.length - 1 ? ',' : ''}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.metadataFooter}>
              <a href={plugin.homepage} target="_blank">
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
        <Downloads plugin={plugin} />
        <Code plugin={plugin} />
      </div>
    </div>
  </article>
);

export default Details;
