import styles from '../styles/components/code.module.css';
import { PluginVersion } from '@studiorack/core';

type CodeProps = {
  plugin: PluginVersion;
};

const Code = ({ plugin }: CodeProps) => (
  <div className={`${styles.code}`}>
    <p>
      Install via{' '}
      <a href="https://www.npmjs.com/package/@studiorack/cli" target="_blank">
        StudioRack CLI
      </a>
    </p>
    {plugin.tags.includes('sfz') ? (
      <span>
        <pre className={styles.codeLine}>studiorack plugin install sfztools/sfizz</pre>
        <pre className={styles.codeLine}>studiorack plugin install {plugin.id}</pre>
      </span>
    ) : plugin.tags.includes('sf2') ? (
      <span>
        <pre className={styles.codeLine}>studiorack plugin install studiorack/juicysf</pre>
        <pre className={styles.codeLine}>studiorack plugin install {plugin.id}</pre>
      </span>
    ) : (
      <pre className={styles.codeLine}>studiorack plugin install {plugin.id}</pre>
    )}
  </div>
);

export default Code;
