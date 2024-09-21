import Layout from '../components/layout';
import styles from '../styles/index.module.css';
import { getBasePath } from '../lib/path';

const Home = () => (
  <Layout>
    <section className={`${styles.section} ${styles.sectionOpenSource}`}>
      <div className={`${styles.container} ${styles.containerCols}`}>
        <div className={styles.inner}>
          <img
            className={styles.sectionImage}
            src={`${getBasePath()}/images/studio-audio-rack-mobile.jpg`}
            alt="Open source"
            loading="lazy"
          />
          <h2 className={styles.title}>An open-source audio plugin ecosystem</h2>
          <p>
            Our tools are built using GitHub and open-source libraries, ensuring you will always be able to access them.
          </p>
          <a className="button" href={`${getBasePath()}/instruments`}>
            Browse instruments
          </a>
        </div>
        <div className={`${styles.inner} ${styles.innerCol}`}>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/_t68k2WFLZs"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
    <section className={`${styles.section} ${styles.sectionProducers}`}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <img
            className={styles.sectionImage}
            src={`${getBasePath()}/images/producers-mobile.jpg`}
            alt="Producers"
            loading="lazy"
          />
          <h2 className={styles.title}>Easy plugin installation &amp; management</h2>
          <p>
            Our app and command line tools allow you to search our plugin registry for free plugins. You can install and
            manage plugin versions all from one place.
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
            src={`${getBasePath()}/images/creators-mobile.jpg`}
            alt="Creators"
            loading="lazy"
          />
          <h2 className={styles.title}>Automate your plugin publishing workflow</h2>
          <p>
            Our plugin starter templates use GitHub Actions to automatically build your plugin, publishing Windows, Mac
            and Linux versions directly to GitHub Releases.
          </p>
          <a className="button" href="https://github.com/studiorack/studiorack-template-clap" target="_blank">
            CLAP
          </a>
          <a className="button" href="https://github.com/studiorack/studiorack-template-dpf" target="_blank">
            DPF
          </a>
          <a className="button" href="https://github.com/studiorack/studiorack-template-dplug" target="_blank">
            Dplug
          </a>
          <a className="button" href="https://github.com/studiorack/studiorack-template-iplug" target="_blank">
            iPlug
          </a>
          <a className="button" href="https://github.com/studiorack/studiorack-template-juce" target="_blank">
            JUCE
          </a>
          <a className="button" href="https://github.com/studiorack/studiorack-template-sf2" target="_blank">
            SF2
          </a>
          <a className="button" href="https://github.com/studiorack/studiorack-template-sfz" target="_blank">
            SFZ
          </a>
          <a className="button" href="https://github.com/studiorack/studiorack-template-steinberg" target="_blank">
            Steinberg
          </a>
        </div>
      </div>
    </section>
  </Layout>
);

export default Home;
