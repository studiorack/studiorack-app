import styles from '../styles/components/card.module.css';
import Link from 'next/link';
import { getBasePath } from '../lib/path';
import { PackageInterface, RegistryType } from '@open-audio-stack/core';

type CardProps = {
  section: RegistryType;
  item: PackageInterface;
  index: number;
};

const Card = ({ section, item, index }: CardProps) => (
  <Link href={`/${section}/[userId]/[pluginId]`} as={`/${section}/${item.slug}`} className={styles.cardLink}>
    <div className={styles.card}>
      <div className={styles.cardDetails}>
        <div className={styles.cardHead}>
          <h4 className={styles.cardTitle}>
            {item.versions[item.version].name} <span className={styles.cardVersion}>v{item.version}</span>
          </h4>
          <p>{item.versions[item.version].installed}</p>
          {item.versions[item.version].installed === true ? (
            <span className={styles.cardButtonInstalled}>
              <img
                className={styles.cardButtonIcon}
                src={`${getBasePath()}/images/icon-installed.svg`}
                alt="Installed"
                loading="lazy"
              />
            </span>
          ) : (
            <span className={styles.cardButton}>
              <img
                className={styles.cardButtonIcon}
                src={`${getBasePath()}/images/icon-download.svg`}
                alt="Download"
                loading="lazy"
              />
            </span>
          )}
        </div>
        <ul className={styles.cardTags}>
          <img className={styles.cardIcon} src={`${getBasePath()}/images/icon-tag.svg`} alt="Tags" loading="lazy" />
          {item.versions[item.version].tags.map((tag: string, tagIndex: number) => (
            <li className={styles.cardTag} key={`${tag}-${tagIndex}-${index}`}>
              {tag}
              {tagIndex !== item.versions[item.version].tags.length - 1 ? ',' : ''}
            </li>
          ))}
        </ul>
      </div>
      {item.versions[item.version].image ? (
        <img
          className={styles.cardImage}
          src={item.versions[item.version].image}
          alt={item.versions[item.version].name}
          loading="lazy"
        />
      ) : (
        ''
      )}
    </div>
  </Link>
);

export default Card;
