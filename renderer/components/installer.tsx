import styles from '../styles/components/download.module.css';
import { PackageInterface, PackageVersion } from '@open-audio-stack/core';

type InstallerProps = {
  pkg: PackageInterface;
  pkgVersion: PackageVersion;
};

const Installer = ({ pkg, pkgVersion }: InstallerProps) => {
  let isDisabled: boolean = false;

  const install = () => {
    console.log('install', pkgVersion);
    if (typeof window !== 'undefined' && window.electronAPI) {
      isDisabled = true;
      window.electronAPI.pluginInstall(pkg).then((pluginInstalled: PackageVersion) => {
        console.log('pluginInstall response', pluginInstalled);
        pkgVersion.installed = true;
        isDisabled = false;
      });
    }
  };

  const uninstall = () => {
    console.log('uninstall', pkgVersion);
    if (typeof window !== 'undefined' && window.electronAPI) {
      isDisabled = true;
      window.electronAPI.pluginUninstall(pkg).then((pluginInstalled: PackageVersion) => {
        console.log('pluginUninstall response', pluginInstalled);
        pkgVersion.installed = false;
        isDisabled = false;
      });
    }
  };

  return (
    <span className={styles.installer}>
      {pkgVersion.installed !== true ? (
        <button className={`button ${styles.installButton}`} onClick={install} disabled={isDisabled}>
          Install<span className={styles.progress}>ing...</span>
        </button>
      ) : (
        <button className={`button ${styles.installButton}`} onClick={uninstall} disabled={isDisabled}>
          Uninstall
        </button>
      )}
    </span>
  );
};

export default Installer;
