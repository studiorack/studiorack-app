import styles from '../styles/components/card.module.css';
import Link from 'next/link';
import { getBasePath } from '../lib/path';
import { imageError } from '../lib/image';
import { pluginFileUrl } from '@studiorack/core';

type CardProps = {
  section: string;
  plugin: any;
  pluginIndex: number;
};

const Card = ({ section, plugin, pluginIndex }: CardProps) => (
  <Link href={`/${section}/[userId]/[pluginId]`} as={`/${section}/${plugin.id}`} className={styles.cardLink}>
    <div className={styles.card}>
      <div className={styles.cardDetails}>
        <div className={styles.cardHead}>
          <h4 className={styles.cardTitle}>
            {plugin.name} <span className={styles.cardVersion}>v{plugin.version}</span>
          </h4>
          <span className={styles.cardButton}>
            <img
              className={styles.cardButtonIcon}
              src={`${getBasePath()}/images/icon-download.svg`}
              alt="Download"
              loading="lazy"
            />
          </span>
        </div>
        <ul className={styles.cardTags}>
          <img className={styles.cardIcon} src={`${getBasePath()}/images/icon-tag.svg`} alt="Tags" loading="lazy" />
          {plugin.tags.map((tag: string, tagIndex: number) => (
            <li className={styles.cardTag} key={`${tag}-${tagIndex}-${pluginIndex}`}>
              {tag}
              {tagIndex !== plugin.tags.length - 1 ? ',' : ''}
            </li>
          ))}
        </ul>
      </div>
      {plugin.files.image ? (
        <img
          className={styles.cardImage}
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

export default Card;
