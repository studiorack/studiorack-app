import { Component } from 'react';
import Crumb from '../../../components/crumb';
import Layout from '../../../components/layout';
import Head from 'next/head.js';
import styles from '../../../styles/plugin.module.css';
import { withRouter, Router } from 'next/router.js';
import { pluginGet, pluginInstalled } from '../../../../node_modules/@studiorack/core/build/plugin';
import { PluginVersionLocal } from '@studiorack/core';
import { pluginFileUrl } from '../../../../node_modules/@studiorack/core/build/utils';
import Dependency from '../../../components/dependency';
import Downloads from '../../../components/download';
import { pluginLicense } from '../../../lib/plugin';

declare global {
  interface Window {
    Sfz: any;
  }
}

type PluginProps = {
  plugin: PluginVersionLocal;
  router: Router;
};

class PluginPage extends Component<
  PluginProps,
  {
    isDisabled: boolean;
    isPlaying: boolean;
    router: Router;
    plugin: PluginVersionLocal;
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
    console.log(props.plugin);
  }

  install = () => {
    console.log('install', this.state.plugin);
    if (typeof window !== 'undefined' && window.electronAPI) {
      this.setState({ isDisabled: true });
      window.electronAPI.pluginInstall(this.state.plugin).then((pluginInstalled: PluginVersionLocal) => {
        console.log('pluginInstall response', pluginInstalled);
        this.state.plugin.paths = pluginInstalled.paths;
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
    if (typeof window !== 'undefined' && window.electronAPI) {
      this.setState({ isDisabled: true });
      window.electronAPI.pluginUninstall(this.state.plugin).then((pluginInstalled: PluginVersionLocal) => {
        console.log('pluginUninstall response', pluginInstalled);
        this.state.plugin.paths = pluginInstalled.paths;
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

  // Prototype of embedded sfz web player.
  // There are better ways to do this.
  loadSfzPlayer(event: React.MouseEvent) {
    const el = document.getElementById('sfzPlayer');
    if (!el) return;
    if (el.className === 'open') {
      el.className = '';
      return;
    }
    const name = (event.currentTarget as HTMLTextAreaElement).getAttribute('data-name') || '';
    const id = (event.currentTarget as HTMLTextAreaElement).getAttribute('data-id') || '';
    console.log('loadSfzPlayer', name, id);
    el.innerHTML = '';
    const player = new window.Sfz.Player('sfzPlayer', {
      audio: {},
      instrument: { name, id },
      interface: {},
    });
    window.setTimeout(() => {
      el.className = 'open';
    }, 0);
  }

  render() {
    return (
      <Layout>
        <Head>
          <title>{this.state.plugin.name || ''}</title>
          <meta name="description" content={this.state.plugin.description || ''} />
          <meta name="og:image" content={pluginFileUrl(this.state.plugin, 'image')} />
          <meta name="og:title" content={this.state.plugin.name || ''} />
        </Head>
        <article>
          <div id="sfzPlayer"></div>
          <div className={styles.header}>
            <div className={styles.headerInner2}>
              <Crumb
                items={[
                  'instruments',
                  this.state.plugin.id?.split('/')[0] || '',
                  this.state.plugin.id?.split('/')[1] || '',
                ]}
              ></Crumb>
            </div>
            <div className={styles.headerInner}>
              <div className={styles.media}>
                <div className={styles.imageContainer}>
                  {this.state.plugin.files.audio ? this.getPlayButton() : ''}
                  {this.state.plugin.tags.includes('sfz') ? (
                    <img
                      className={styles.sfzPlayer}
                      data-name={this.state.plugin.name}
                      data-id={this.state.plugin.id}
                      src={`${this.state.router.basePath}/images/sfz-player.png`}
                      alt="open in sfz player"
                      loading="lazy"
                      onClick={this.loadSfzPlayer}
                    />
                  ) : (
                    ''
                  )}
                  {this.state.plugin.files.image ? (
                    <img
                      className={styles.image}
                      src={pluginFileUrl(this.state.plugin, 'image')}
                      alt={this.state.plugin.name || ''}
                    />
                  ) : (
                    ''
                  )}
                </div>
                {this.state.plugin.files.audio ? (
                  <audio src={pluginFileUrl(this.state.plugin, 'audio')} id="audio">
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
                <p>
                  {this.state.plugin.description}
                  <Dependency plugin={this.state.plugin} message />
                </p>
                <div className={styles.metadataList}>
                  {/* <div className={styles.metadata}><img className={styles.icon} src={`${this.state.router.basePath}/images/icon-filesize.svg`} alt="Filesize" loading="lazy" /> {this.formatBytes(this.state.plugin.size)}</div> */}
                  <div className={styles.metadata}>
                    <img
                      className={styles.icon}
                      src={`${this.state.router.basePath}/images/icon-date.svg`}
                      alt="Date updated"
                      loading="lazy"
                    />{' '}
                    {this.timeSince(this.state.plugin.date)} ago
                  </div>
                  <div className={styles.metadata}>
                    <img
                      className={styles.icon}
                      src={`${this.state.router.basePath}/images/icon-license.svg`}
                      alt="License"
                      loading="lazy"
                    />{' '}
                    {this.state.plugin.license ? (
                      <a href={pluginLicense(this.state.plugin.license).url} target="_blank">
                        {pluginLicense(this.state.plugin.license).name}
                      </a>
                    ) : (
                      'none'
                    )}
                  </div>
                  <div className={styles.metadata}>
                    <img
                      className={styles.icon}
                      src={`${this.state.router.basePath}/images/icon-tag.svg`}
                      alt="Tags"
                      loading="lazy"
                    />
                    <ul className={styles.tags}>
                      {this.state.plugin.tags.map((tag: string, tagIndex: number) => (
                        <li className={styles.tag} key={`${tag}-${tagIndex}`}>
                          {tag}
                          {tagIndex !== this.state.plugin.tags.length - 1 ? ',' : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.metadataFooter}>
                    {this.state.plugin.status !== 'installed' ? (
                      <button className={styles.button} onClick={this.install} disabled={this.state.isDisabled}>
                        Install<span className={styles.progress}>ing...</span>
                      </button>
                    ) : (
                      <button className="button button" onClick={this.uninstall} disabled={this.state.isDisabled}>
                        Uninstall
                      </button>
                    )}
                    <a href={this.state.plugin.homepage} target="_blank">
                      <button className="button button-clear">View source</button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.options}>
            <div className={styles.row}>
              <div className={`${styles.cell} ${styles.download}`}>
                <p>Download and install manually:</p>
                <Downloads plugin={this.state.plugin} />
              </div>
              <div className={`${styles.cell} ${styles.install}`}>
                <p>
                  Install via{' '}
                  <a href="https://www.npmjs.com/package/@studiorack/cli" target="_blank">
                    StudioRack CLI
                  </a>
                  :
                </p>
                <Dependency plugin={this.state.plugin} />
                <pre className={styles.codeBox}>studiorack plugin install {this.state.plugin.id}</pre>
              </div>
            </div>
          </div>
        </article>
      </Layout>
    );
  }
}
export default withRouter(PluginPage);

type Params = {
  params: {
    pluginId: string;
    userId: string;
  };
};

export async function getServerSideProps({ params }: Params) {
  const plugin: PluginVersionLocal = (await pluginGet(`${params.userId}/${params.pluginId}`)) as PluginVersionLocal;
  plugin.status = pluginInstalled(plugin) ? 'installed' : 'available';
  console.log(plugin);
  return {
    props: {
      plugin,
    },
  };
}
