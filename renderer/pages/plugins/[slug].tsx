import { Component } from 'react'
import Layout from '../../components/layout'
import { getPluginData, Plugin } from '../../lib/plugins'
import Head from 'next/head'
import styles from '../../styles/plugin.module.css'
import { withRouter, Router } from 'next/router'

type PluginProps = {
  plugin: Plugin,
  router: Router,
  slug: string
}

class PluginPage extends Component<PluginProps, {
  isPlaying: Boolean,
  router: Router,
  plugin: Plugin
}> {

  constructor(props: PluginProps) {
    super(props)
    console.log('props', props);
    this.state = {
      isPlaying: false,
      plugin: {} as Plugin,
      router: props.router
    }

    console.log('slug', props.router.query.slug);
    // check if registry has plugin metadata
    getPluginData(props.router.query.slug as string).then((plugin: Plugin) => {
      if (plugin) {
        console.log('getPluginData', plugin)
        this.setState({ plugin: plugin })
      // otherwise fallback to auto-generated local metadata
      } else if (global && global.ipcRenderer) {
          global.ipcRenderer.invoke('get-plugin', props.router.query.slug).then((plugin) => {
            console.log('get-plugin', plugin)
            this.setState({ plugin: plugin })
          })
        }
      })
  }

  install = () => {
    console.log('install', this.state.plugin)
    if (global && global.ipcRenderer) {
      global.ipcRenderer.invoke('installPlugin', this.state.plugin).then((plugin) => {
        console.log('installPlugin response', plugin)
        this.setState({ plugin: plugin })
      })
    }
  }

  uninstall = () => {
    console.log('uninstall', this.state.plugin)
    if (global && global.ipcRenderer) {
      global.ipcRenderer.invoke('uninstallPlugin', this.state.plugin).then((plugin) => {
        console.log('uninstallPlugin response', plugin)
        this.setState({ plugin: plugin })
      })
    }
  }

  play = () => {
    const el = document.getElementById('audio') as HTMLAudioElement
    if (el.paused) {
      el.removeEventListener('ended', this.ended)
      el.addEventListener('ended', this.ended)
      el.currentTime = 0
      el.play()
      this.setState({ isPlaying: true })
    }
  }

  pause = () => {
    const el = document.getElementById('audio') as HTMLAudioElement
    if (!el.paused) {
      el.pause()
      this.setState({ isPlaying: false })
    }
  }

  ended = () => {
    this.setState({ isPlaying: false })
  }

  render() {
    return (
    <Layout>
      <Head>
        <title>{this.state.plugin.name || ''}</title>
      </Head>
      <article>
        <div className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.media}>
              <div className={styles.imageContainer}>
              {this.state.isPlaying ?
                <img className={styles.imagePlay} src={`${this.state.router.basePath}/static/icon-pause.svg`} alt="Pause" onClick={this.pause} />
                :
                <img className={styles.imagePlay} src={`${this.state.router.basePath}/static/icon-play.svg`} alt="Play" onClick={this.play} />
              }
                <img className={styles.image} src={`https://github.com/${this.state.plugin.id}/releases/download/v${this.state.plugin.version}/plugin.png`} alt={this.state.plugin.name} />
              </div>
              <audio src={`https://github.com/${this.state.plugin.id}/releases/download/v${this.state.plugin.version}/plugin.wav`} id="audio">Your browser does not support the audio element.</audio>
            </div>
            <div className={styles.details}>
              <h3 className={styles.title}>{this.state.plugin.name} <span className={styles.version}>v{this.state.plugin.version}</span></h3>
              <p className={styles.author}>By <a href={this.state.plugin.homepage} target="_blank">{this.state.plugin.author}</a></p>
              <p>{this.state.plugin.description}</p>
              <ul className={styles.tags}>
                <img className={styles.icon} src={`${this.state.router.basePath}/static/icon-tag.svg`} alt="Tags" />
                {this.state.plugin.tags && 
                  this.state.plugin.tags.map((tag) => (
                    <li className={styles.tag} key={tag}>{tag},</li>
                  ))
                }
              </ul>
              {this.state.plugin.status !== 'installed' ?
                <a className="button" onClick={this.install}>Install</a>
                :
                <a className="button button-clear" onClick={this.uninstall}>Uninstall</a>
              }
            </div>
          </div>
        </div>
        {this.state.plugin.status !== 'installed' ?
          <div className={styles.options}>
            <div className={styles.row}>
              <div className={`${styles.cell} ${styles.download}`}>
                <p>Download .zip file:</p>
                <a className="button" href={`https://github.com/${this.state.plugin.id}/releases/download/v${this.state.plugin.version}/plugin-linux.zip`}>Linux</a>
                <a className="button" href={`https://github.com/${this.state.plugin.id}/releases/download/v${this.state.plugin.version}/plugin-mac.zip`}>MacOS</a>
                <a className="button" href={`https://github.com/${this.state.plugin.id}/releases/download/v${this.state.plugin.version}/plugin-win.zip`}>Windows</a>
              </div>
              <div className={`${styles.cell} ${styles.install}`}>
                <p>Install via command line:</p>
                <pre className={styles.codeBox}>studiorack install {this.state.plugin.id}</pre>
              </div>
            </div>
          </div>
          :
          <div className={styles.options}>
            <div className={styles.row}>
              <div className={`${styles.cell} ${styles.download}`}>
                <p>Plugin location:</p>
                <pre className={styles.codeBox}>{this.state.plugin.path}</pre>
              </div>
            </div>
          </div>
        }
      </article>
    </Layout>
    )
  }
}
export default withRouter(PluginPage)
