import { Component } from 'react'
import Layout from '../../components/layout'
import Head from 'next/head'
import styles from '../../styles/plugin.module.css'
import { GetStaticPaths } from 'next'
import { withRouter, Router } from 'next/router'
import { Project } from '@studiorack/core'
import { slugToId } from '../../../node_modules/@studiorack/core/dist/utils'

type ProjectProps = {
  project: Project,
  router: Router
}

class ProjectPage extends Component<ProjectProps, {
  isDisabled: boolean,
  isPlaying: boolean,
  router: Router,
  project: Project
}> {

  constructor(props: ProjectProps) {
    super(props)
    this.state = {
      isDisabled: false,
      isPlaying: false,
      project: props.project,
      router: props.router
    }
    console.log('props.project', props.project, props.router.query.slug);

    // If project is not found in registry, fallback to auto-generated local metadata
    if (!props.project.name && global && global.ipcRenderer) {
      global.ipcRenderer.invoke('projectGet', slugToId(props.router.query.slug as string)).then((project) => {
        console.log('projectGet', project)
        this.setState({ project: project })
      })
    }
  }

  open = () => {
    console.log('open', this.state.project)
    if (global && global.ipcRenderer) {
      this.setState({ isDisabled: true })
      global.ipcRenderer.invoke('projectOpen', this.state.project.path).then((projectOpened) => {
        console.log('projectOpen response', projectOpened)
        this.setState({
          isDisabled: false
        })
      })
    }
  }

  formatBytes(bytes:number, decimals = 2) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  timeSince(date:string) {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    let interval = seconds / 31536000
    if (interval > 1) {
      return Math.floor(interval) + " years"
    }
    interval = seconds / 2592000
    if (interval > 1) {
      return Math.floor(interval) + " months"
    }
    interval = seconds / 86400
    if (interval > 1) {
      return Math.floor(interval) + " days"
    }
    interval = seconds / 3600
    if (interval > 1) {
      return Math.floor(interval) + " hours"
    }
    interval = seconds / 60
    if (interval > 1) {
      return Math.floor(interval) + " minutes"
    }
    return Math.floor(seconds) + " seconds"
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

  getPlayButton() {
    if (this.state.isPlaying) {
      return <img className={styles.imagePlay} src={`${this.state.router.basePath}/images/icon-pause.svg`} alt="Pause" onClick={this.pause} />
    } else {
      return <img className={styles.imagePlay} src={`${this.state.router.basePath}/images/icon-play.svg`} alt="Play" onClick={this.play} />
    }
  }

  getFolder(path: string) {
    return path.slice(0, path.lastIndexOf('/'));
  }

  render() {
    return (
    <Layout>
      <Head>
        <title>{this.state.project.name || ''}</title>
      </Head>
      <article>
        <div className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.media}>
              <div className={styles.imageContainer}>
              {this.state.project.files.audio ?
                this.getPlayButton()
                : ''
              }
              {this.state.project.files.image ?
                <img className={styles.image} src={`media://${this.getFolder(this.state.project.path || 'none')}/${this.state.project.files.image.name}`} alt={this.state.project.name || ''} />
                : ''
              }
              </div>
              {this.state.project.files.audio ?
                <audio src={`media://${this.getFolder(this.state.project.path || 'none')}/${this.state.project.files.audio.name}`} id="audio">Your browser does not support the audio element.</audio>
                : ''
              }
            </div>
            <div className={styles.details}>
              <h3 className={styles.title}>{this.state.project.name || ''} <span className={styles.version}>v{this.state.project.version}</span></h3>
              <p className={styles.author}>By <a href={this.state.project.homepage} target="_blank">{this.state.project.author}</a></p>
              <p>{this.state.project.description}</p>
              <div className={styles.metadataList}>
                <div className={styles.metadata}><img className={styles.icon} src={`${this.state.router.basePath}/images/icon-filesize.svg`} alt="Filesize" /> {this.formatBytes(this.state.project.files.project?.size || 0)}</div>
                <div className={styles.metadata}><img className={styles.icon} src={`${this.state.router.basePath}/images/icon-date.svg`} alt="Date updated" /> {this.timeSince(this.state.project.date)} ago</div>
                <div className={styles.metadata}>
                  <img className={styles.icon} src={`${this.state.router.basePath}/images/icon-tag.svg`} alt="Tags" />
                    <ul className={styles.tags}>
                    { this.state.project.tags && this.state.project.tags.map((tag) => (
                      <li className={styles.tag} key={tag}>{tag},</li>
                    ))}
                  </ul>
                </div>
                <button className="button" onClick={this.open} disabled={this.state.isDisabled}>Open</button>	
              </div>
            </div>
          </div>
        </div>
        <div className={styles.options}>
          <div className={styles.row}>
            <div className={`${styles.cell} ${styles.download}`}>
              <p>Project files:</p>
              { this.state.project.files.audio ? 
                <a className={`button ${styles.button}`} href={`media://${this.getFolder(this.state.project.path || 'none')}/${this.state.project.files.audio?.name}`}>{this.state.project.files.audio?.name}</a>
                : ''
              }
              { this.state.project.files.image ?
                <a className={`button ${styles.button}`} href={`media://${this.getFolder(this.state.project.path || 'none')}/${this.state.project.files.image?.name}`}>{this.state.project.files.image?.name}</a>
                : ''
              }
              { this.state.project.files.project ?
                <a className={`button ${styles.button}`} href={`media://${this.getFolder(this.state.project.path || 'none')}/${this.state.project.files.project?.name}`}>{this.state.project.files.project?.name}</a>
                : ''
              }
            </div>
            <div className={`${styles.cell} ${styles.install}`}>
              <p>Project path:</p>
              <pre className={styles.codeBox}>{this.state.project.path}</pre>
            </div>
          </div>
        </div>
      </article>
    </Layout>
    )
  }
}
export default withRouter(ProjectPage)

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: false
  }
}

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {
  console.log(params.slug)
  return {
    props: {
      project: { files: {} } as Project
    }
  }
}
