import styles from '../styles/plugin.module.css';
import { getBasePath } from '../lib/path';
import { PluginVersion } from '@studiorack/core';

type DependencyProps = {
  plugin: PluginVersion;
  message?: boolean;
};

const Dependency = ({ plugin, message = false }: DependencyProps) => {
  if (plugin.tags.includes('sfz')) {
    if (message) {
      return (
        <span>
          {' '}
          (This instrument needs to be loaded into a{' '}
          <a href={`${getBasePath()}/instruments/studiorack/sfizz`} target="_blank">
            SFZ player
          </a>
          )
        </span>
      );
    } else {
      return <pre className={styles.codeBox}>studiorack plugin install studiorack/sfizz</pre>;
    }
  } else if (plugin.tags.includes('sf2')) {
    if (message) {
      return (
        <span>
          {' '}
          (This instrument needs to be loaded into a{' '}
          <a href={`${getBasePath()}/instruments/studiorack/juicysf`} target="_blank">
            SoundFont 2 player
          </a>
          )
        </span>
      );
    } else {
      return <pre className={styles.codeBox}>studiorack plugin install studiorack/juicysf</pre>;
    }
  } else {
    return <span />;
  }
};

export default Dependency;
