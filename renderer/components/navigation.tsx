import styles from '../styles/components/navigation.module.css';
import { getBasePath, isSelected } from '../lib/path';
import { ELECTRON_APP } from '../lib/utils';
import { RegistryType } from '@open-audio-stack/core';

const Navigation = () => (
  <div>
    <input className={styles.navMenuBtn} type="checkbox" id="menu-btn" />
    <label className={styles.navMenuIcn} htmlFor="menu-btn">
      <span className={styles.navMenuNavIcn}></span>
    </label>
    <ul className={styles.navMenu}>
      <li>
        <a
          href={`${getBasePath()}/${RegistryType.Plugins}`}
          className={`${styles.navItem} ${isSelected(`/${RegistryType.Plugins}`)}`}
        >
          Plugins
        </a>
      </li>
      <li>
        <a
          href={`${getBasePath()}/${RegistryType.Presets}`}
          className={`${styles.navItem} ${isSelected(`/${RegistryType.Presets}`)}`}
        >
          Presets
        </a>
      </li>
      <li>
        <a
          href={`${getBasePath()}/${RegistryType.Projects}`}
          className={`${styles.navItem} ${isSelected(`/${RegistryType.Projects}`)}`}
        >
          Projects
        </a>
      </li>
      {ELECTRON_APP ? (
        <li>
          <a href={`${getBasePath()}/settings`} className={`${styles.navItem} ${isSelected('/settings')}`}>
            Settings
          </a>
        </li>
      ) : (
        <li>
          <a href={`${getBasePath()}/docs`} className={`${styles.navItem} ${isSelected('/docs')}`}>
            Docs
          </a>
        </li>
      )}
      {!ELECTRON_APP ? (
        <li>
          <a href="https://discord.gg/9D94f98PxP" className={`${styles.navButton} button`} target="_blank">
            Community
            <img
              className={styles.navButtonIcon}
              src={`${getBasePath()}/images/icon-external-link.svg`}
              alt="External link"
              loading="lazy"
            />
          </a>
        </li>
      ) : (
        ''
      )}
    </ul>
  </div>
);

export default Navigation;
