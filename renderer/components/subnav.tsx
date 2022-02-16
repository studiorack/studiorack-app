import Doc from '../types/doc';
import styles from '../styles/components/subnav.module.css';
import { getBasePath, isSelected } from '../lib/path';

type SubNavProps = {
  children: React.ReactNode;
  docs: Doc[];
};

const SubNav = ({ children, docs }: SubNavProps) => (
  <div className={styles.subnav}>
    <div className={styles.sidebar}>
      <h4>Documentation</h4>
      <ul className={styles.menu}>
        {docs.map((doc) => {
          return doc.slug === '06-command-line' ? (
            ''
          ) : (
            <li className={styles.menuItem} key={doc.slug}>
              <a href={`${getBasePath()}/docs/${doc.slug}`} className={isSelected(`/docs/${doc.slug}`)}>
                {doc.title}
              </a>
            </li>
          );
        })}
      </ul>
      <h4>API Reference</h4>
      <ul className={styles.menu}>
        <li className={styles.menuItem} key="06-command-line">
          <a href={`${getBasePath()}/docs/06-command-line`} className={isSelected(`/docs/06-command-line`)}>
            Command line
          </a>
        </li>
      </ul>
    </div>
    <div className={styles.content}>{children}</div>
  </div>
);

export default SubNav;
