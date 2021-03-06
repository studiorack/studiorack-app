import { Component } from 'react';
import Head from 'next/head';
import Layout, { siteTitle } from '../../components/layout';
import styles from '../../styles/settings.module.css';
import { GetStaticProps } from 'next';
import { withRouter, Router } from 'next/router';
import { IpcRenderer } from 'electron';

declare global {
  namespace NodeJS {
    interface Global {
      ipcRenderer: IpcRenderer;
    }
  }
}

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    webkitdirectory?: string;
  }
}

type Setting = {
  name: string;
  description: string;
  value: string;
};

type SettingsProps = {
  router: Router;
};

class Settings extends Component<
  SettingsProps,
  {
    isDisabled: boolean;
    router: Router;
    settingsFiltered: { [property: string]: Setting };
    query: string;
    value: string;
  }
> {
  constructor(props: SettingsProps) {
    super(props);
    this.state = {
      isDisabled: false,
      settingsFiltered: {
        projectFolder: {
          name: 'Project directory',
          description: 'Path to a folder containing your music project files.',
          value: '',
        },
        pluginFolder: {
          name: 'Plugin directory',
          description: 'Path to a folder used to install your plugins.',
          value: '',
        },
      },
      router: props.router,
      query: '',
      value: '',
    };

    // Prototype, find better way to do this
    if (global && global.ipcRenderer) {
      const promises: Promise<any>[] = [];
      Object.keys(this.state.settingsFiltered).forEach((settingKey: string) => {
        promises.push(global.ipcRenderer.invoke('storeGet', settingKey));
      });
      Promise.all(promises).then((responses) => {
        responses.forEach((response) => {
          this.state.settingsFiltered[response.key].value = response.value;
        });
        this.setState({ settingsFiltered: this.state.settingsFiltered });
      });
    }
  }

  open = (settingKey: string) => {
    if (global && global.ipcRenderer) {
      this.setState({ isDisabled: true });
      global.ipcRenderer.invoke('folderSelect', this.state.settingsFiltered[settingKey].value).then((response) => {
        console.log('folderSelect response', response);
        if (!response || !response.filePaths[0]) return this.setState({ isDisabled: false });
        this.state.settingsFiltered[settingKey].value = response.filePaths[0];
        this.setState({
          isDisabled: false,
          settingsFiltered: this.state.settingsFiltered,
        });
        global.ipcRenderer.invoke('storeSet', settingKey, response.filePaths[0]).then((response) => {
          if (!response) return;
          console.log('storeSet', settingKey, response);
        });
      });
    }
  };

  render() {
    return (
      <Layout>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <section className={styles.settings}>
          <div className={styles.settingsHeader}>
            <h3 className={styles.settingsTitle}>Settings</h3>
          </div>
          <div className={styles.settingsList}>
            {Object.keys(this.state.settingsFiltered).map((settingKey: string, settingIndex: number) => (
              <div className={styles.setting} key={`${settingKey}-${settingIndex}`}>
                <div className={styles.settingHead}>
                  <h4 className={styles.settingTitle}>{this.state.settingsFiltered[settingKey].name}</h4>
                  <p>{this.state.settingsFiltered[settingKey].description}</p>
                </div>
                <div className={styles.settingControl}>
                  <pre className={styles.settingPath}>{this.state.settingsFiltered[settingKey].value}</pre>
                  <button className="button" onClick={() => this.open(settingKey)} disabled={this.state.isDisabled}>
                    Change
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Layout>
    );
  }
}
export default withRouter(Settings);

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};
