import { Component, SyntheticEvent } from 'react';
import Layout from '../../../../components/layout';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../../../../styles/plugin.module.css';
import stylesPlugin from '../../../../styles/plugins.module.css';
import { GetServerSideProps } from 'next';
import { withRouter, Router } from 'next/router';
import { configSet, pluginGet, pluginInstalled, PluginLocal, projectGetLocal, ProjectLocal } from '@studiorack/core';
import { idToSlug, slugToId } from '@studiorack/core/dist/utils';
import { store } from '../../../../../electron-src/store';
import { Params } from 'next/dist/server/router';

type ProjectProps = {
  pluginsFiltered: PluginLocal[];
  project: ProjectLocal;
  router: Router;
};

class ProjectPage extends Component<
  ProjectProps,
  {
    isDisabled: boolean;
    isPlaying: boolean;
    pluginsFiltered: PluginLocal[];
    project: ProjectLocal;
    router: Router;
  }
> {
  constructor(props: ProjectProps) {
    super(props);
    this.state = {
      isDisabled: false,
      isPlaying: false,
      pluginsFiltered: props.pluginsFiltered,
      project: props.project,
      router: props.router,
    };
    console.log('project', props.router.query.slug);

    // If project is not found in registry, fallback to auto-generated local metadata
    if (!props.project.name && window.electronAPI) {
      const projectId: string = slugToId(props.router.query.slug as string);
      window.electronAPI.projectGetLocal(projectId).then((project: ProjectLocal) => {
        console.log('pluginGetLocal', project);
        this.setState({ project });
      });
    }
  }

  install = () => {
    console.log('install', this.state.project);
    if (typeof window !== 'undefined' && window.electronAPI) {
      this.setState({ isDisabled: true });
      window.electronAPI.pluginsInstall(this.state.project.plugins).then((pluginsInstalled: PluginLocal[]) => {
        console.log('pluginsInstall response', pluginsInstalled);
        this.setState({
          isDisabled: false,
          pluginsFiltered: pluginsInstalled,
        });
      });
    }
  };

  open = (path: string) => {
    console.log('open', this.state.project);
    if (typeof window !== 'undefined' && window.electronAPI) {
      this.setState({ isDisabled: true });
      window.electronAPI.projectOpen(path).then((projectOpened: Buffer) => {
        console.log('projectOpen response', projectOpened);
        this.setState({
          isDisabled: false,
        });
      });
    }
  };

  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  timeSince(date: string) {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 2) {
      return Math.floor(interval) + ' years';
    }
    if (interval > 1) {
      return Math.floor(interval) + ' year';
    }
    interval = seconds / 2592000;
    if (interval > 2) {
      return Math.floor(interval) + ' months';
    }
    if (interval > 1) {
      return Math.floor(interval) + ' month';
    }
    interval = seconds / 86400;
    if (interval > 2) {
      return Math.floor(interval) + ' days';
    }
    if (interval > 1) {
      return Math.floor(interval) + ' day';
    }
    interval = seconds / 3600;
    if (interval > 2) {
      return Math.floor(interval) + ' hours';
    }
    if (interval > 1) {
      return Math.floor(interval) + ' hour';
    }
    interval = seconds / 60;
    if (interval > 2) {
      return Math.floor(interval) + ' minutes';
    }
    if (interval > 1) {
      return Math.floor(interval) + ' minute';
    }
    return Math.floor(seconds) + ' seconds';
  }

  play = () => {
    const el = document.getElementById('audio') as HTMLAudioElement;
    if (el.paused) {
      el.removeEventListener('ended', this.ended);
      el.addEventListener('ended', this.ended);
      el.currentTime = 0;
      el.play();
      this.setState({ isPlaying: true });
    }
  };

  pause = () => {
    const el = document.getElementById('audio') as HTMLAudioElement;
    if (!el.paused) {
      el.pause();
      this.setState({ isPlaying: false });
    }
  };

  ended = () => {
    this.setState({ isPlaying: false });
  };

  getPlayButton() {
    if (this.state.isPlaying) {
      return (
        <img
          className={styles.imagePlay}
          src={`${this.state.router.basePath}/images/icon-pause.svg`}
          alt="Pause"
          onClick={this.pause}
          loading="lazy"
        />
      );
    } else {
      return (
        <img
          className={styles.imagePlay}
          src={`${this.state.router.basePath}/images/icon-play.svg`}
          alt="Play"
          onClick={this.play}
          loading="lazy"
        />
      );
    }
  }

  getFolder(path: string) {
    return path.slice(0, path.lastIndexOf('/'));
  }

  imageError = (event: SyntheticEvent) => {
    const el = event.target as HTMLImageElement;
    const fallback = `${this.state.router.basePath}/images/plugin.png`;
    if (el.getAttribute('src') !== fallback) {
      el.setAttribute('src', fallback);
    }
    return undefined;
  };

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
                  {this.state.project.files.audio && this.state.project.files.audio.size ? this.getPlayButton() : ''}
                  {this.state.project.files.image && this.state.project.files.image.size ? (
                    <img
                      className={styles.image}
                      src={`media://${this.getFolder(this.state.project.path || 'none')}/${
                        this.state.project.files.image.name
                      }`}
                      alt={this.state.project.name || ''}
                      loading="lazy"
                    />
                  ) : (
                    ''
                  )}
                </div>
                {this.state.project.files.audio && this.state.project.files.audio.size ? (
                  <audio
                    src={`media://${this.getFolder(this.state.project.path || 'none')}/${
                      this.state.project.files.audio.name
                    }`}
                    id="audio"
                  >
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  ''
                )}
              </div>
              <div className={styles.details}>
                <h3 className={styles.title}>
                  {this.state.project.name || ''} <span className={styles.version}>v{this.state.project.version}</span>
                </h3>
                <p className={styles.author}>
                  By{' '}
                  <a href={this.state.project.homepage} target="_blank">
                    {this.state.project.author}
                  </a>
                </p>
                <p>{this.state.project.description}</p>
                <div className={styles.metadataList}>
                  <div className={styles.metadata}>
                    <img
                      className={styles.icon}
                      src={`${this.state.router.basePath}/images/icon-filesize.svg`}
                      alt="Filesize"
                      loading="lazy"
                    />{' '}
                    {this.formatBytes(this.state.project.files.project?.size || 0)}
                  </div>
                  <div className={styles.metadata}>
                    <img
                      className={styles.icon}
                      src={`${this.state.router.basePath}/images/icon-date.svg`}
                      alt="Date updated"
                      loading="lazy"
                    />{' '}
                    {this.timeSince(this.state.project.date)} ago
                  </div>
                  <div className={styles.metadata}>
                    <img
                      className={styles.icon}
                      src={`${this.state.router.basePath}/images/icon-tag.svg`}
                      alt="Tags"
                      loading="lazy"
                    />
                    <ul className={styles.tags}>
                      {this.state.project.tags &&
                        this.state.project.tags.map((tag: string, tagIndex: number) => (
                          <li className={styles.tag} key={`${tag}-${tagIndex}`}>
                            {tag},
                          </li>
                        ))}
                    </ul>
                  </div>
                  <button className="button" onClick={() => this.open(`${this.state.project.path}/${this.state.project.name}.${this.state.project.type.ext}`)} disabled={this.state.isDisabled}>
                    Open project
                  </button>
                  <button className="button" onClick={() => this.open(this.state.project.path)} disabled={this.state.isDisabled}>
                    Open folder
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* <div className={styles.options}>
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
        </div> */}
          <div className={stylesPlugin.plugins}>
            <div className={stylesPlugin.pluginsHeader}>
              <h3 className={stylesPlugin.pluginsTitle}>
                Plugins <span className={stylesPlugin.pluginCount}>({this.state.pluginsFiltered.length})</span>
              </h3>
              <div className={styles.pluginsSearch}>
                {this.state.pluginsFiltered.length > 0 ? (
                  <button className="button" onClick={this.install} disabled={this.state.isDisabled}>
                    Install all
                  </button>
                ) : (
                  <Link href={`${this.state.router.basePath}/plugins`}>
                    <a className="button">Browse plugins</a>
                  </Link>
                )}
              </div>
            </div>
            <div className={stylesPlugin.pluginsList}>
              {this.state.pluginsFiltered.map((plugin, pluginIndex) => (
                <Link
                  href="/plugins/[slug]"
                  as={`/plugins/${idToSlug(plugin.repo + '/' + plugin.id)}`}
                  key={`${idToSlug(plugin.repo + '/' + plugin.id)}-${pluginIndex}`}
                >
                  <div className={stylesPlugin.plugin}>
                    <div className={stylesPlugin.pluginDetails}>
                      <div className={stylesPlugin.pluginHead}>
                        <h4 className={stylesPlugin.pluginTitle}>
                          {plugin.name} <span className={stylesPlugin.pluginVersion}>v{plugin.version}</span>
                        </h4>
                        {plugin.status === 'installed' ? (
                          <span className={stylesPlugin.pluginButtonInstalled}>
                            <img
                              className={stylesPlugin.pluginButtonIcon}
                              src={`${this.state.router.basePath}/images/icon-installed.svg`}
                              alt="Installed"
                              loading="lazy"
                            />
                          </span>
                        ) : (
                          <span className={stylesPlugin.pluginButton}>
                            <img
                              className={stylesPlugin.pluginButtonIcon}
                              src={`${this.state.router.basePath}/images/icon-download.svg`}
                              alt="Download"
                              loading="lazy"
                            />
                          </span>
                        )}
                      </div>
                      <ul className={stylesPlugin.pluginTags}>
                        <img
                          className={stylesPlugin.pluginIcon}
                          src={`${this.state.router.basePath}/images/icon-tag.svg`}
                          alt="Tags"
                          loading="lazy"
                        />
                        {plugin.tags.map((tag: string, tagIndex: number) => (
                          <li className={stylesPlugin.pluginTag} key={`${tag}-${tagIndex}-${pluginIndex}`}>
                            {tag},
                          </li>
                        ))}
                      </ul>
                    </div>
                    {plugin.files.image && plugin.files.image.size ? (
                      <img
                        className={stylesPlugin.pluginImage}
                        src={`https://github.com/${plugin.repo}/releases/download/${plugin.release}/${plugin.files.image.name}`}
                        alt={plugin.name}
                        onError={this.imageError}
                        loading="lazy"
                      />
                    ) : (
                      <img
                        className={stylesPlugin.pluginImage}
                        src={`${this.state.router.basePath}/images/plugin.png`}
                        alt={plugin.name}
                        onError={this.imageError}
                        loading="lazy"
                      />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </Layout>
    );
  }
}
export default withRouter(ProjectPage);

export const getServerSideProps: GetServerSideProps = async ({ params }: Params) => {
  configSet('projectFolder', store.get('projectFolder'));
  console.log(`${params.userId}/${params.repoId}/${params.pluginId}`);
  const project = await projectGetLocal(`${params.userId}/${params.repoId}/${params.pluginId}`);
  console.log(project);
  const promises = Object.keys(project.plugins).map(async (pluginId) => {
    const pluginLocal: PluginLocal = (await pluginGet(pluginId)) as PluginLocal;
    pluginLocal.status = pluginInstalled(pluginLocal) ? 'installed' : 'available';
    return pluginLocal;
  });
  const pluginsFiltered: PluginLocal[] = await Promise.all(promises);
  console.log(pluginsFiltered);
  return {
    props: {
      project,
      pluginsFiltered,
    },
  };
};
