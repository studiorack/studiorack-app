import { Component } from 'react'
import Layout from '../../components/layout'
import { getAllPluginPaths, getPluginData, Plugin } from '../../lib/plugins'
import Head from 'next/head'
import styles from '../../styles/plugin.module.css'
import { GetStaticProps, GetStaticPaths } from 'next'
import { withRouter, Router } from 'next/router'

class PluginPage extends Component<{
  plugin: Plugin,
  router: Router
}, {
  isPlaying: Boolean,
  router: Router,
  plugin: Plugin
}> {

  constructor(props) {
    super(props)
    this.state = {
      isPlaying: false,
      plugin: props.plugin,
      router: props.router
    }
  }

  play = () => {
    const el = document.getElementById('audio') as HTMLAudioElement
    if (el.paused) {
      el.removeEventListener('ended', this.ended);
      el.addEventListener('ended', this.ended);
      el.currentTime = 0;
      el.play();
      this.setState({ isPlaying: true });
    }
  }

  pause = () => {
    const el = document.getElementById('audio') as HTMLAudioElement
    if (!el.paused) {
      el.pause();
      this.setState({ isPlaying: false });
    }
  }

  ended = () => {
    this.setState({ isPlaying: false });
  }

  render() {
    return (
    <Layout>
      <Head>
        <title>{this.state.plugin.name}</title>
      </Head>
      <article>
        <div className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.media}>
              <div className={styles.imageContainer}>
              {this.state.isPlaying ?
                <img className={styles.imagePlay} src={`${this.state.router.basePath}/images/icon-pause.svg`} alt="Pause" onClick={this.pause} />
                :
                <img className={styles.imagePlay} src={`${this.state.router.basePath}/images/icon-play.svg`} alt="Play" onClick={this.play} />
              }
                <img className={styles.image} src={`https://github.com/${this.state.plugin.id}/releases/latest/download/plugin.png`} alt={this.state.plugin.name} />
              </div>
              <audio src={`https://github.com/${this.state.plugin.id}/releases/latest/download/plugin.wav`} id="audio">Your browser does not support the audio element.</audio>
            </div>
            <div className={styles.details}>
              <h3 className={styles.title}>{this.state.plugin.name} <span className={styles.version}>v{this.state.plugin.version}</span></h3>
              <p className={styles.author}>By <a href={this.state.plugin.homepage} target="_blank">{this.state.plugin.author}</a></p>
              <p>{this.state.plugin.description}</p>
              <ul className={styles.tags}>
                <img className={styles.icon} src={`${this.state.router.basePath}/images/icon-tag.svg`} alt="Tags" />
                {this.state.plugin.tags.map((tag) => (
                  <li className={styles.tag} key={tag}>{tag},</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.options}>
          <div className={styles.row}>
            <div className={`${styles.cell} ${styles.download}`}>
              <p>Download .zip file:</p>
              <a className={`button ${styles.button}`} href={`https://github.com/${this.state.plugin.id}/releases/latest/download/plugin-linux.zip`}>Linux</a>
              <a className={`button ${styles.button}`} href={`https://github.com/${this.state.plugin.id}/releases/latest/download/plugin-mac.zip`}>MacOS</a>
              <a className={`button ${styles.button}`} href={`https://github.com/${this.state.plugin.id}/releases/latest/download/plugin-win.zip`}>Windows</a>
            </div>
            <div className={`${styles.cell} ${styles.install}`}>
              <p>Install via command line:</p>
              <pre className={styles.codeBox}>studiorack install {this.state.plugin.id}</pre>
            </div>
          </div>
        </div>
      </article>
    </Layout>
    )
  }
}
export default withRouter(PluginPage)

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPluginPaths()
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const plugin = await getPluginData(params.slug as string)
  return {
    props: {
      plugin
    }
  }
}
