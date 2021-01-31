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
          value: '/Users/yourname/Library/Mobile Documents/com~apple~CloudDocs/Ableton'
        },
        {
          name: 'Plugin directory',
          description: 'Path to a folder used to install your plugins.',
          value: '/Library/Audio/Plug-ins/VST3'
        }
      ],
      router: props.router,
      query: '',
      value: ''
    };
  }

  open = (settingIndex: number) => {
    if (global && global.ipcRenderer) {
      this.setState({ isDisabled: true })
      global.ipcRenderer.invoke('folderSelect').then((response) => {
        console.log('folderSelect response', response.filePaths[0])
        this.state.settingsFiltered[settingIndex].value = response.filePaths[0];
        this.setState({
          isDisabled: false,
          settingsFiltered: this.state.settingsFiltered
        })
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
