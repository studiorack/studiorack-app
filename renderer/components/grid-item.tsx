import styles from '../styles/components/grid-item.module.css';
import Link from 'next/link';
import { getBasePath } from '../lib/path';
import { imageError } from '../lib/image';
import { pluginFileUrl } from '../../node_modules/@studiorack/core/dist/utils';

type GridItemProps = {
  section: string;
  plugin: any;
  pluginIndex: number;
};

const GridItem = ({ section, plugin, pluginIndex }: GridItemProps) => (
  <Link href={`/${section}/[userId]/[repoId]/[pluginId]`} as={`/${section}/${plugin.repo}/${plugin.id}`}>
    <div className={styles.plugin}>
      <div className={styles.pluginDetails}>
        <div className={styles.pluginHead}>
          <h4 className={styles.pluginTitle}>
            {plugin.name} <span className={styles.pluginVersion}>v{plugin.version}</span>
          </h4>
          <span className={styles.pluginButton}>
            <img
              className={styles.pluginButtonIcon}
              src={`${getBasePath()}/images/icon-download.svg`}
              alt="Download"
              loading="lazy"
            />
          </span>
        </div>
        <ul className={styles.pluginTags}>
          <img className={styles.pluginIcon} src={`${getBasePath()}/images/icon-tag.svg`} alt="Tags" loading="lazy" />
          {plugin.tags.map((tag: string, tagIndex: number) => (
            <li className={styles.pluginTag} key={`${tag}-${tagIndex}-${pluginIndex}`}>
              {tag},
            </li>
          ))}
        </ul>
      </div>
      {plugin.files.image ? (
        <img
          className={styles.pluginImage}
          src={pluginFileUrl(plugin, 'image')}
          alt={plugin.name}
          onError={imageError}
          loading="lazy"
        />
      ) : (
        ''
      )}
    </div>
  </Link>
);

export default GridItem;
