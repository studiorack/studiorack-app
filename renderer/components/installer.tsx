import { useState } from 'react';
import styles from '../styles/components/download.module.css';
import { PackageInterface, PackageVersion, RegistryType } from '@open-audio-stack/core';

type InstallerProps = {
  pkg: PackageInterface;
  pkgVersion: PackageVersion;
  type: RegistryType;
};

const Installer = ({ pkg, pkgVersion, type }: InstallerProps) => {
  const [isDisabled, setDisabled] = useState(false);
  const [, setPkVersion] = useState(pkgVersion);

  const install = () => {
    console.log('install', pkgVersion);
    if (typeof window !== 'undefined' && window.electronAPI) {
      setDisabled(true);
      window.electronAPI.install(type, pkg).then((pkgResponse: PackageVersion) => {
        console.log('install response', pkgResponse);
        pkgVersion.installed = pkgResponse.installed;
        setPkVersion(pkgVersion);
        setDisabled(false);
      });
    }
  };

  const uninstall = () => {
    console.log('uninstall', pkgVersion);
    if (typeof window !== 'undefined' && window.electronAPI) {
      setDisabled(true);
      window.electronAPI.uninstall(type, pkg).then((pkgResponse: PackageVersion) => {
        console.log('uninstall response', pkgResponse);
        pkgVersion.installed = pkgResponse.installed;
        setPkVersion(pkgVersion);
        setDisabled(false);
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
