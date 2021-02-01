import { Component } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../../components/layout'
import styles from '../../styles/settings.module.css'
import { GetStaticProps } from 'next'
import { withRouter, Router } from 'next/router'
import { IpcRenderer } from 'electron'

declare global {
  namespace NodeJS {
    interface Global {
      ipcRenderer: IpcRenderer
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
}

type SettingsProps = {
  router: Router
}

class Settings extends Component<SettingsProps, {
  isDisabled: boolean,
  router: Router,
  settingsFiltered: Setting[],
  query: string,
  value: string
}> {

  constructor(props: SettingsProps) {
    super(props)
    this.state = {
      isDisabled: false,
      settingsFiltered: [
        {
          name: 'Project directory',
          description: 'Path to a folder containing your music project files.',
          value: ''
        },
        {
          name: 'Plugin directory',
          description: 'Path to a folder used to install your plugins.',
          value: ''
        }
      ],
      router: props.router,
      query: '',
      value: ''
    };

    // Prototype, find better way to do this
    if (global && global.ipcRenderer) {
      global.ipcRenderer.invoke('storeGet', 'projectFolder').then((response) => {
        console.log('storeGet 0 response', response)
        if (!response) return;
        this.state.settingsFiltered[0].value = response;
        this.setState({ settingsFiltered: this.state.settingsFiltered })
        global.ipcRenderer.invoke('storeGet', 'pluginFolder').then((response) => {
          console.log('storeGet 1 response', response)
          if (!response) return;
          this.state.settingsFiltered[1].value = response;
          this.setState({ settingsFiltered: this.state.settingsFiltered })
        })
      })
    }
  }

  open = (settingIndex: number) => {
    if (global && global.ipcRenderer) {
      this.setState({ isDisabled: true })
      global.ipcRenderer.invoke('folderSelect', this.state.settingsFiltered[settingIndex].value).then((response) => {
        console.log('folderSelect response', response)
        if (!response || !response.filePaths[0]) return this.setState({ isDisabled: false });
        this.state.settingsFiltered[settingIndex].value = response.filePaths[0];
        this.setState({
          isDisabled: false,
          settingsFiltered: this.state.settingsFiltered
        })
        global.ipcRenderer.invoke('storeSet', 'projectFolder', response.filePaths[0]).then((response) => {
          if (!response) return;
          console.log('storeSet projectFolder', response);
        });
      })
    }
  }

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
            {this.state.settingsFiltered.map((setting, settingIndex) => (
              <div className={styles.setting} key={settingIndex}>
                <div className={styles.settingHead}>
                  <h4 className={styles.settingTitle}>{setting.name}</h4>
                  <p>{setting.description}</p>
                </div>
                <div className={styles.settingControl}>
                  <pre className={styles.settingPath}>{setting.value}</pre>
                  <button className="button" onClick={() => this.open(settingIndex)} disabled={this.state.isDisabled}>Change</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Layout>
    )
  }
}
export default withRouter(Settings)

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
    }
  }
}
