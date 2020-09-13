import { Component } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import Link from 'next/link'
import styles from '../styles/index.module.css'
import { withRouter, Router } from 'next/router'

type HomeProps = {
  router: Router,
  query: string
}

class Home extends Component<HomeProps, {
  router: Router
  query: string
}> {

  constructor(props: HomeProps) {
    super(props)
    this.state = {
      router: props.router,
      query: ''
    }
  }

  render() {
    return (
      <Layout>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <section className={`${styles.section} ${styles.sectionCreators}`}>
          <div className={styles.container}>
            <div className={styles.inner}>
              <img className={styles.sectionImage} src={`${this.state.router.basePath}/images/creators-mobile.jpg`} alt="Creators" />
              <h2 className={styles.title}>Automate your plugin publishing workflow</h2>
              <p>Our plugin starter template uses GitHub Actions to build your plugin with the Steinberg VST3 SDK, publishing a new version straight to Github Releases.</p>
              <Link href={`${this.state.router.basePath}/docs`}>
                <a className="button">Get started</a>
              </Link>
            </div>
          </div>
        </section>
        <section className={`${styles.section} ${styles.sectionProducers}`}>
          <div className={styles.container}>
            <div className={styles.inner}>
              <img className={styles.sectionImage} src={`${this.state.router.basePath}/images/producers-mobile.jpg`} alt="Producers" />
              <h2 className={styles.title}>Easy plugin installation &amp; management</h2>
              <p>Our app and command line tools allow you to search our plugin registry for free plugins. You can install and manage plugin versions all from one place.</p>
              <Link href={`${this.state.router.basePath}/docs`}>
                <a className="button">Get started</a>
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    )
  }
}
export default withRouter(Home)
