import Head from 'next/head';
import Navigation from './navigation';
import styles from '../styles/components/layout.module.css';
import { getBasePath } from '../lib/path';
import { pageTitle } from '../lib/utils';

export const siteTitle = 'StudioRack';
export const siteDesc = 'Automate your plugin publishing workflow, easy plugin installation and management';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => (
  <div className={styles.layoutContainer}>
    <Head>
      <title>{pageTitle(['An open-source audio plugin ecosystem'])}</title>
      <meta name="description" content={siteDesc} />
      <meta name="og:image" content={`${getBasePath()}/images/creators-mobile.jpg`} />
      <meta name="og:title" content={siteTitle} />
      <meta name="twitter:card" content="summary_large_image" />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&amp;display=swap"
        rel="stylesheet"
      ></link>
      <link rel="apple-touch-icon" sizes="180x180" href={`${getBasePath()}/icons/apple-touch-icon.png`} />
      <link rel="icon" type="image/png" sizes="32x32" href={`${getBasePath()}/icons/favicon-32x32.png`} />
      <link rel="icon" type="image/png" sizes="16x16" href={`${getBasePath()}/icons/favicon-16x16.png`} />
      <link rel="manifest" href={`${getBasePath()}/icons/site.webmanifest`}></link>
    </Head>
    <header className={styles.layoutHeader}>
      <a href={`${getBasePath()}/`} className={styles.layoutLink}>
        <img src={`${getBasePath()}/images/studio-rack-logo.svg`} alt={siteTitle} loading="lazy" />
        <span className={styles.layoutLogo}>
          Studio<span className={styles.layoutLogoBold}>Rack</span>
        </span>
      </a>
      <Navigation></Navigation>
    </header>
    <main>{children}</main>
  </div>
);

export default Layout;
