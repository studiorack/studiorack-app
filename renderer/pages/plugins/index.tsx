import { Component, ChangeEvent, MouseEvent } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../../components/layout'
import styles from '../../styles/index.module.css'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { getPlugins, Plugin } from '../../lib/plugins'
import { withRouter, Router } from 'next/router'

type PluginListProps = {
  category: string,
  plugins: Plugin[],
  router: Router
}

class PluginList extends Component<PluginListProps, {
  category: string,
  pluginsFiltered: Plugin[]
  router: Router
  query: string,
}> {

  constructor(props: PluginListProps) {
    super(props)
    this.state = {
      category: props.category,
      pluginsFiltered: props.plugins,
      router: props.router,
      query: ''
    }
  }

  handleChange = (event: ChangeEvent) => {
    const el = event.target as HTMLInputElement;
    const query = el.value ? el.value.toLowerCase() : ''
    const filtered = this.props.plugins.filter((plugin) => {
      if (plugin.name.toLowerCase().indexOf(query) != -1 ||
        plugin.description.toLowerCase().indexOf(query) != -1 ||
        plugin.tags.includes(query)) {
        return plugin
      }
      return false
    })
    this.setState({
      pluginsFiltered: filtered,
      query: query
    })
  }

  isSelected = (path: string) => {
    return this.state.category === path ? 'active' : ''
  }

  selectCategory = (event: MouseEvent) => {
    this.setState({
      category: event.currentTarget.getAttribute('data-category') || '',
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
            {this.state.pluginsFiltered.map(({ id, slug, name, tags, version}) => (
              <Link href="/plugins/[slug]" as={`/plugins/${slug}`} key={name}>
                <div className={styles.plugin}>
                  <img className={styles.pluginImage} src={`https://github.com/${id}/releases/latest/download/plugin.png`} alt={name} />
                  <div className={styles.pluginDetails}>
                    <h4 className={styles.pluginTitle}>{name} <span className={styles.pluginVersion}>v{version}</span></h4>
                    <ul className={styles.pluginTags}>
                      <img className={styles.pluginIcon} src={`${this.state.router.basePath}/images/icon-tag.svg`} alt="Tags" />
                      {tags.map((tag) => (
                        <li className={styles.pluginTag} key={tag}>{tag},</li>
                      ))}
                    </ul>
                  </div>
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
