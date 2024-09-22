import styles from '../styles/components/card.module.css';
import Link from 'next/link';
import { getBasePath } from '../lib/path';
import { pluginFileUrl } from '@studiorack/core';

type CardProps = {
  section: string;
  item: any;
  index: number;
};

const Card = ({ section, item, index }: CardProps) => (
  <Link
    href={`/${section}/[userId]/[${section === 'projects' ? 'projectId' : 'pluginId'}]`}
    as={`/${section}/${item.id}`}
    className={styles.cardLink}
  >
    <div className={styles.card}>
      <div className={styles.cardDetails}>
        <div className={styles.cardHead}>
          <h4 className={styles.cardTitle}>
            {item.name} <span className={styles.cardVersion}>v{item.version}</span>
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
          {item.tags.map((tag: string, tagIndex: number) => (
            <li className={styles.cardTag} key={`${tag}-${tagIndex}-${index}`}>
              {tag}
              {tagIndex !== item.tags.length - 1 ? ',' : ''}
            </li>
          ))}
        </ul>
      </div>
      {item.files.image ? (
        <img className={styles.cardImage} src={pluginFileUrl(item, 'image')} alt={item.name} loading="lazy" />
      ) : (
        ''
      )}
    </div>
  </Link>
);

export default Card;
