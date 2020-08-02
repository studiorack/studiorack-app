import { Component } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../../components/layout'
import styles from '../../styles/index.module.css'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { getPlugins, Plugin } from '../../lib/plugins'
import { withRouter, Router } from 'next/router'

class PluginList extends Component<{
  plugins: Plugin[],
  router: Router
}, {
  pluginsFiltered: Plugin[]
  router: Router
  query: string,
}> {

  constructor(props) {
    super(props)
    this.state = {
      pluginsFiltered: props.plugins,
      router: props.router,
      query: ''
    }
  }

  handleChange = (event) => {
    const query = event.target.value.toLowerCase()
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

  render() {
    return (
      <Layout>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <section className={styles.plugins}>
          <div className={styles.pluginsHeader}>
            <h3 className={styles.pluginsTitle}>Plugins</h3>
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
