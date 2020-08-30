import { Component, ChangeEvent, MouseEvent } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../../components/layout'
import styles from '../../styles/plugins.module.css'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { getPlugins, Plugin } from '../../lib/plugins'
import { withRouter, Router } from 'next/router'
import { IpcRenderer } from 'electron'
import slugify from 'slugify'

declare global {
  namespace NodeJS {
    interface Global {
      ipcRenderer: IpcRenderer
    }
  }
}

type PluginListProps = {
  category: string,
  plugins: Plugin[],
  router: Router
}

class PluginList extends Component<PluginListProps, {
  category: string,
  plugins: Plugin[]
  pluginsFiltered: Plugin[]
  router: Router
  query: string,
}> {
  list: Plugin[]

  constructor(props: PluginListProps) {
    super(props)
    this.state = {
      category: 'all',
      plugins: props.plugins,
      pluginsFiltered: props.plugins,
      router: props.router,
      query: ''
    }
    this.list = props.plugins;
    if (global && global.ipcRenderer) {
      global.ipcRenderer.invoke('get-plugins').then((plugins) => {
        plugins = plugins.map((plugin: Plugin) => {
          plugin.id = 'studiorack/studiorack-plugin'
          plugin.slug = slugify(plugin.name, { lower: true })
          return plugin
        })
        this.list = this.list.concat(plugins)
        console.log(plugins)
        this.setState({
          plugins: this.list,
          pluginsFiltered: this.list
        })
      })
    }
  }

  filterPlugins = () => {
    console.log('filterPlugins', this.state);
    return this.state.plugins.filter((plugin) => {
      if (
          (
            this.state.category === 'all' ||
            this.state.category === plugin.status
          )
          &&
          (
            plugin.name.toLowerCase().indexOf(this.state.query) !== -1 ||
            plugin.description.toLowerCase().indexOf(this.state.query) !== -1 ||
            plugin.tags.includes(this.state.query)
          )) {
        return plugin
      }
      return false
    })
  }

  handleChange = (event: ChangeEvent) => {
    const el = event.target as HTMLInputElement;
    const query = el.value ? el.value.toLowerCase() : ''
    this.setState({ query: query }, () => {
      this.setState({ pluginsFiltered: this.filterPlugins() })
    })
  }

  isSelected = (path: string) => {
    return this.state.category === path ? 'selected' : ''
  }

  selectCategory = (event: MouseEvent) => {
    const category = event.currentTarget.getAttribute('data-category') || ''
    this.setState({ category: category }, () => {
      this.setState({ pluginsFiltered: this.filterPlugins() })
    })
  }

  render() {
    return (
      <Layout>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <section className={styles.plugins}>
          <h3 className={styles.pluginsTitle}>Plugins</h3>
          <div className={styles.pluginsHeader}>
            <ul className={styles.pluginsCategory}>
              <li><a data-category="all" onClick={this.selectCategory} className={this.isSelected('all')}>All</a></li>
              <li><a data-category="installed" onClick={this.selectCategory} className={this.isSelected('installed')}>Installed</a></li>
              <li><a data-category="updates" onClick={this.selectCategory} className={this.isSelected('updates')}>Updates</a></li>
            </ul>
            <input className={styles.pluginsSearch} placeholder="Filter by keyword" value={this.state.query} onChange={this.handleChange} />
          </div>
          <div className={styles.pluginsList}>
            {this.state.pluginsFiltered.map((plugin, pluginIndex) => (
              <Link href="/plugins/[slug]" as={`/plugins/${plugin.slug}`} key={`${plugin.name}-${pluginIndex}`}>
                <div className={styles.plugin}>
                  <div className={styles.pluginDetails}>
                    <div className={styles.pluginHead}>
                      <h4 className={styles.pluginTitle}>{plugin.name} <span className={styles.pluginVersion}>v{plugin.version}</span></h4>
                      {plugin.status === 'installed' ?
                        <span className={styles.pluginButtonInstalled}><img className={styles.pluginButtonIcon} src={`${this.state.router.basePath}/images/icon-installed.svg`} alt="Installed" /></span>
                        :
                        <span className={styles.pluginButton}><img className={styles.pluginButtonIcon} src={`${this.state.router.basePath}/images/icon-download.svg`} alt="Download" /></span>
                      }
                    </div>
                    <ul className={styles.pluginTags}>
                      <img className={styles.pluginIcon} src={`${this.state.router.basePath}/images/icon-tag.svg`} alt="Tags" />
                      {plugin.tags.map((tag, tagIndex) => (
                        <li className={styles.pluginTag} key={`${tag}-${tagIndex}`}>{tag},</li>
                      ))}
                    </ul>
                  </div>
                  <img className={styles.pluginImage} src={`https://github.com/${plugin.id}/releases/download/v${plugin.version}/plugin.png`} alt={plugin.name} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Layout>
    )
  }
}
export default withRouter(PluginList)

export const getStaticProps: GetStaticProps = async () => {
  const plugins = await getPlugins()
  return {
    props: {
      plugins
    }
  }
}
