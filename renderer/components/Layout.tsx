import Head from 'next/head'
import Navigation from './navigation'
import styles from '../styles/layout.module.css'
import { useRouter } from 'next/router'

export const siteTitle = 'StudioRack'
export const siteDesc = 'Automate your plugin publishing workflow, easy plugin installation and management'

export default function Layout({
  children
}: {
  children: React.ReactNode
}) {
  const {basePath} = useRouter()
  return (
    <div className={styles.container}>
      <Head>
        <meta name="description" content={siteDesc} />
        <meta property="og:image" content={`${basePath}/images/creators-mobile.jpg`} />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&amp;display=swap" rel="stylesheet"></link>
        <link rel="apple-touch-icon" sizes="180x180" href={`${basePath}/icons/apple-touch-icon.png`} />
        <link rel="icon" type="image/png" sizes="32x32" href={`${basePath}/icons/favicon-32x32.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`${basePath}/icons/favicon-16x16.png`} />
        <link rel="manifest" href={`${basePath}/icons/site.webmanifest`}></link>
      </Head>
      <header className={styles.header}>
        <a href={`${basePath}/`} className={styles.headerLink}>
          <img className={styles.logoImage} src={`${basePath}/images/studio-rack-logo.svg`} alt={siteTitle} />
          <span className={styles.logoText}>Studio<span className={styles.logoTextBold}>Rack</span></span>
        </a>
        <Navigation></Navigation>
      </header>
      <main>{children}</main>
    </div>
  )
}
