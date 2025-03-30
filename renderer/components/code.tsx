import { PackageInterface, PackageVersion } from '@open-audio-stack/core';
import styles from '../styles/components/code.module.css';

type CodeProps = {
  pkg: PackageInterface;
  pkgVersion: PackageVersion;
};

const Code = ({ pkg, pkgVersion }: CodeProps) => (
  <div className={`${styles.code}`}>
    <p>
      Install via{' '}
      <a href="https://www.npmjs.com/package/@studiorack/cli" target="_blank">
        StudioRack CLI
      </a>
    </p>
    {pkgVersion.tags.includes('sfz') ? (
      <span>
        <pre className={styles.codeLine}>studiorack plugin install sfztools/sfizz</pre>
        <pre className={styles.codeLine}>studiorack plugin install {pkg.slug}</pre>
      </span>
    ) : pkgVersion.tags.includes('sf2') ? (
      <span>
        <pre className={styles.codeLine}>studiorack plugin install birch-san/juicysfplugin</pre>
        <pre className={styles.codeLine}>studiorack plugin install {pkg.slug}</pre>
      </span>
    ) : (
      <pre className={styles.codeLine}>studiorack plugin install {pkg.slug}</pre>
    )}
  </div>
);

export default Code;
