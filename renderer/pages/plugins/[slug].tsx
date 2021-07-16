import { Component } from 'react';
import Layout from '../../components/layout';
import Head from 'next/head';
import styles from '../../styles/plugin.module.css';
import { GetServerSideProps } from 'next';
import { withRouter, Router } from 'next/router';
import { pluginGet, pluginGetLocal, PluginLocal } from '@studiorack/core';
import { slugToId } from '../../../node_modules/@studiorack/core/dist/utils';
import { Params } from 'next/dist/next-server/server/router';

type PluginProps = {
  plugin: PluginLocal;
  router: Router;
};

class PluginPage extends Component<
  PluginProps,
  {
    isDisabled: boolean;
    isPlaying: boolean;
    plugin: PluginLocal;
    router: Router;
  }
> {
  constructor(props: PluginProps) {
    super(props);
    this.state = {
      isDisabled: false,
      isPlaying: false,
      plugin: props.plugin,
      router: props.router,
    };
    console.log('plugin', props.router.query.slug);

    // If plugin is not found in registry, fallback to auto-generated local metadata
    // if (!props.plugin.name && global && global.ipcRenderer) {
    //   global.ipcRenderer.invoke('pluginGetLocal', slugToId(props.router.query.slug as string)).then((plugin) => {
    //     console.log('pluginGetLocal', plugin)
    //     this.setState({ plugin: plugin })
    //   })
    // }
  }

  install = () => {
    console.log('install', this.state.plugin);
    if (global && global.ipcRenderer) {
      this.setState({ isDisabled: true });
      global.ipcRenderer.invoke('pluginInstall', this.state.plugin).then((pluginInstalled) => {
        console.log('pluginInstall response', pluginInstalled);
        this.state.plugin.path = pluginInstalled.path;
        this.state.plugin.status = pluginInstalled.status;
        this.setState({
          isDisabled: false,
          plugin: this.state.plugin,
        });
      });
    }
  };

  uninstall = () => {
    console.log('uninstall', this.state.plugin);
    if (global && global.ipcRenderer) {
      this.setState({ isDisabled: true });
      global.ipcRenderer.invoke('pluginUninstall', this.state.plugin).then((pluginInstalled) => {
        console.log('pluginUninstall response', pluginInstalled);
        this.state.plugin.path = pluginInstalled.path;
        this.state.plugin.status = pluginInstalled.status;
        this.setState({
          isDisabled: false,
          plugin: this.state.plugin,
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
    if (interval > 1) {
      return Math.floor(interval) + ' years';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + ' months';
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + ' days';
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + ' hours';
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + ' minutes';
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
        />
      );
    } else {
      return (
        <img
          className={styles.imagePlay}
          src={`${this.state.router.basePath}/images/icon-play.svg`}
          alt="Play"
          onClick={this.play}
        />
      );
    }
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
                  {this.state.plugin.files.audio && this.state.plugin.files.audio.size ? this.getPlayButton() : ''}
                  {this.state.plugin.files.image && this.state.plugin.files.image.size ? (
                    <img
                      className={styles.image}
                      src={`https://github.com/${this.state.plugin.repo}/releases/download/${this.state.plugin.release}/${this.state.plugin.files.image.name}`}
                      alt={this.state.plugin.name || ''}
                    />
                  ) : (
                    ''
                  )}
                </div>
                {this.state.plugin.files.audio && this.state.plugin.files.audio.size ? (
                  <audio
                    src={`https://github.com/${this.state.plugin.repo}/releases/download/${this.state.plugin.release}/${this.state.plugin.files.audio.name}`}
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
                  {this.state.plugin.name || ''} <span className={styles.version}>v{this.state.plugin.version}</span>
                </h3>
                <p className={styles.author}>
                  By{' '}
                  <a href={this.state.plugin.homepage} target="_blank">
                    {this.state.plugin.author}
                  </a>
                </p>
                <p>{this.state.plugin.description}</p>
                <div className={styles.metadataList}>
                  {/* <div className={styles.metadata}><img className={styles.icon} src={`${this.state.router.basePath}/images/icon-filesize.svg`} alt="Filesize" /> {this.formatBytes(this.state.plugin.size)}</div> */}
                  <div className={styles.metadata}>
                    <img
                      className={styles.icon}
                      src={`${this.state.router.basePath}/images/icon-date.svg`}
                      alt="Date updated"
                    />{' '}
                    {this.timeSince(this.state.plugin.date)} ago
                  </div>
                  <div className={styles.metadata}>
                    <img
                      className={styles.icon}
                      src={`${this.state.router.basePath}/images/icon-license.svg`}
                      alt="License"
                    />{' '}
                    {this.state.plugin.license ? (
                      <a href={this.state.plugin.license.url} target="_blank">
                        {this.state.plugin.license.name}
                      </a>
                    ) : (
                      'none'
                    )}
                  </div>
                  <div className={styles.metadata}>
                    <img className={styles.icon} src={`${this.state.router.basePath}/images/icon-tag.svg`} alt="Tags" />
                    <ul className={styles.tags}>
                      {this.state.plugin.tags &&
                        this.state.plugin.tags.map((tag: string, tagIndex: number) => (
                          <li className={styles.tag} key={`${tag}-${tagIndex}`}>
                            {tag},
                          </li>
                        ))}
                    </ul>
                  </div>
                  {this.state.plugin.status !== 'installed' ? (
                    <button className="button" onClick={this.install} disabled={this.state.isDisabled}>
                      Install
                    </button>
                  ) : (
                    <button className="button button-clear" onClick={this.uninstall} disabled={this.state.isDisabled}>
                      Uninstall
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          {this.state.plugin.status !== 'installed' ? (
            <div className={styles.options}>
              <div className={styles.row}>
                <div className={`${styles.cell} ${styles.download}`}>
                  <p>Download and install manually:</p>
                  {this.state.plugin.files.linux ? (
                    <a
                      className={`button ${styles.button}`}
                      href={`https://github.com/${this.state.plugin.repo}/releases/download/${this.state.plugin.release}/${this.state.plugin.files.linux.name}`}
                    >
                      Linux
                    </a>
                  ) : (
                    ''
                  )}
                  {this.state.plugin.files.mac ? (
                    <a
                      className={`button ${styles.button}`}
                      href={`https://github.com/${this.state.plugin.repo}/releases/download/${this.state.plugin.release}/${this.state.plugin.files.mac.name}`}
                    >
                      MacOS
                    </a>
                  ) : (
                    ''
                  )}
                  {this.state.plugin.files.win ? (
                    <a
                      className={`button ${styles.button}`}
                      href={`https://github.com/${this.state.plugin.repo}/releases/download/${this.state.plugin.release}/${this.state.plugin.files.win.name}`}
                    >
                      Windows
                    </a>
                  ) : (
                    ''
                  )}
                </div>
                <div className={`${styles.cell} ${styles.install}`}>
                  <p>Install via command line:</p>
                  <pre className={styles.codeBox}>
                    studiorack plugin install {this.state.plugin.repo}/{this.state.plugin.id}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.options}>
              <div className={styles.row}>
                <div className={`${styles.cell} ${styles.download}`}>
                  <p>Plugin location:</p>
                  <pre className={styles.codeBox}>{this.state.plugin.path}</pre>
                </div>
              </div>
            </div>
          )}
        </article>
      </Layout>
    );
  }
}
export default withRouter(PluginPage);

export const getServerSideProps: GetServerSideProps = async ({ params }: Params) => {
  const pluginId = slugToId(params.slug);
  let plugin: PluginLocal;

  try {
    // Check if live plugin registry metadata exists
    console.log('pluginGet', pluginId, await pluginGet(pluginId));
    plugin = (await pluginGet(pluginId)) as PluginLocal;

    try {
      // If local plugin exists, use the path and status
      const pluginLocal = await pluginGetLocal(pluginId);
      plugin.path = pluginLocal.path;
      plugin.status = pluginLocal.status;
    } catch (error) {}
  } catch (error) {
    // Otherwise fallback to local plugin metadata
    console.log('pluginGetLocal', pluginId, await pluginGetLocal(pluginId));
    plugin = await pluginGetLocal(pluginId);
  }

  return {
    props: {
      plugin,
    },
  };
};
