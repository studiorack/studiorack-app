import styles from '../styles/components/crumb.module.css';
import { getBasePath, getCrumbUrl } from '../lib/path';

type CrumbProps = {
  items: string[];
};

const Crumb = ({ items }: CrumbProps) => (
  <div className={styles.crumb}>
    <ul className={styles.crumbList}>
      {items.map((item: string, itemIndex: number) => (
        <li className={styles.crumbItem} key={`${item}-${itemIndex}`}>
          /
          <a className={styles.crumbLink} href={`${getBasePath()}${getCrumbUrl(items, item)}`}>
            {item}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default Crumb;
