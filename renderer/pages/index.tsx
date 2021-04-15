import { Component } from 'react';
import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import Link from 'next/link';
import styles from '../styles/index.module.css';
import { withRouter, Router } from 'next/router';

type HomeProps = {
  router: Router;
  query: string;
};

class Home extends Component<
  HomeProps,
  {
    router: Router;
    query: string;
  }
> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      router: props.router,
      query: '',
    };
  }

  render() {
    return (
      <Layout>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <section className={`${styles.section} ${styles.sectionOpenSource}`}>
          <div className={styles.container}>
            <div className={styles.inner}>
              <img
                className={styles.sectionImage}
                src={`${this.state.router.basePath}/images/studio-audio-rack-mobile.jpg`}
                alt="Open source"
              />
              <h2 className={styles.title}>An open-source audio plugin ecosystem</h2>
              <p>
                Our tools are built using GitHub and open-source libraries, ensuring you will always be able to access
                them.
              </p>
              <Link href={`${this.state.router.basePath}/plugins`}>
                <a className="button">Browse plugins</a>
              </Link>
            </div>
          </div>
        </section>
        <section className={`${styles.section} ${styles.sectionProducers}`}>
          <div className={styles.container}>
            <div className={styles.inner}>
              <img
                className={styles.sectionImage}
                src={`${this.state.router.basePath}/images/producers-mobile.jpg`}
                alt="Producers"
              />
              <h2 className={styles.title}>Easy plugin installation &amp; management</h2>
              <p>
                Our app and command line tools allow you to search our plugin registry for free plugins. You can install
                and manage plugin versions all from one place.
              </p>
              <a className="button" href="https://github.com/studiorack/studiorack-app/releases/latest" target="_blank">
                Download the app
              </a>{' '}
              <a className="button button-clear" href="https://www.npmjs.com/package/@studiorack/cli" target="_blank">
                Install the CLI
              </a>
            </div>
          </div>
        </section>
        <section className={`${styles.section} ${styles.sectionCreators}`}>
          <div className={styles.container}>
            <div className={styles.inner}>
              <img
                className={styles.sectionImage}
                src={`${this.state.router.basePath}/images/creators-mobile.jpg`}
                alt="Creators"
              />
              <h2 className={styles.title}>Automate your plugin publishing workflow</h2>
              <p>
                Our plugin starter templates use GitHub Actions to automatically build your plugin, publishing Windows,
                Mac and Linux versions directly to GitHub Releases.
              </p>
              <a className="button" href="https://github.com/studiorack/studiorack-plugin-dplug" target="_blank">
                Dplug
              </a>
              <a className="button" href="https://github.com/studiorack/studiorack-plugin-iplug" target="_blank">
                iPlug
              </a>
              <a className="button" href="https://github.com/studiorack/studiorack-plugin-juce" target="_blank">
                JUCE
              </a>
              <a className="button" href="https://github.com/studiorack/studiorack-plugin-steinberg" target="_blank">
                Steinberg
              </a>
            </div>
          </div>
        </section>
      </Layout>
    );
  }
}
export default withRouter(Home);
