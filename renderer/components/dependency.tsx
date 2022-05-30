import styles from '../styles/plugin.module.css';
import { PluginInterface } from '@studiorack/core';

type DependencyProps = {
  plugin: PluginInterface;
  message?: boolean;
};

const Dependency = ({ plugin, message = false }: DependencyProps) => {
  if (plugin.tags.includes('sfz')) {
    if (message) {
      return (
        <span>
          {' '}
          (This instrument needs to be loaded into a{' '}
          <a href="/instruments/studiorack/sfizz/sfizz" target="_blank">
            SFZ player
          </a>
          )
        </span>
      );
    } else {
      return <pre className={styles.codeBox}>studiorack plugin install studiorack/sfizz/sfizz</pre>;
    }
  } else if (plugin.tags.includes('sf2')) {
    if (message) {
      return (
        <span>
          {' '}
          (This instrument needs to be loaded into a{' '}
          <a href="/instruments/studiorack/juicysf/juicysf" target="_blank">
            SoundsFont 2 player
          </a>
          )
        </span>
      );
    } else {
      return <pre className={styles.codeBox}>studiorack plugin install studiorack/juicysf/juicysf</pre>;
    }
  } else {
    return <div />;
  }
};

export default Dependency;
