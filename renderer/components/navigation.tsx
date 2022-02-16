import styles from '../styles/components/navigation.module.css';
import { getBasePath, isSelected } from '../lib/path';

const Navigation = () => (
  <div className={styles.navigation}>
    <input className={styles.menuBtn} type="checkbox" id="menu-btn" />
    <label className={styles.menuIcn} htmlFor="menu-btn">
      <span className={styles.menuNavIcn}></span>
    </label>
    <ul className={styles.menu}>
      <li>
        <a href={`${getBasePath()}/projects`} className={`${styles.navItem} ${isSelected('/projects')}`}>
          Projects
        </a>
      </li>
      <li>
        <a href={`${getBasePath()}/instruments`} className={`${styles.navItem} ${isSelected('/instruments')}`}>
          Instruments
        </a>
      </li>
      <li>
        <a href={`${getBasePath()}/effects`} className={`${styles.navItem} ${isSelected('/effects')}`}>
          Effects
        </a>
      </li>
      <li>
        <a href={`${getBasePath()}/settings`} className={`${styles.navItem} ${isSelected('/settings')}`}>
          Settings
        </a>
      </li>
    </ul>
  </div>
);

export default Navigation;
