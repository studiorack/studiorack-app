import { Component, ChangeEvent } from 'react';
import Head from 'next/head';
import { withRouter, Router } from 'next/router';
import Layout, { siteTitle } from '../../components/layout';
import styles from '../../styles/plugins.module.css';
import GridItem from '../../components/grid-item';
import { GetServerSideProps } from 'next';
import {
  PluginCategory,
  pluginInstalled,
  PluginInterface,
  pluginLatest,
  PluginLocal,
  PluginPack,
  pluginsGet,
} from '@studiorack/core';
import { configDefaults } from '@studiorack/core/dist/config-defaults';
import { filterPlugins } from '../../lib/plugin';

type PluginListProps = {
  category: string;
  pluginTypes: { [property: string]: PluginCategory };
  plugins: PluginInterface[];
  pluginsFiltered: PluginInterface[];
  query: string;
  router: Router;
};

class PluginList extends Component<
  PluginListProps,
  {
    category: string;
    pluginTypes: { [property: string]: PluginCategory };
    plugins: PluginInterface[];
    pluginsFiltered: PluginInterface[];
    query: string;
    router: Router;
  }
> {
  constructor(props: PluginListProps) {
    super(props);
    const params = props.router.query;
    const category = (params.category as string) || 'all';
    const pluginTypes = configDefaults('appFolder', 'pluginFolder', 'projectFolder').pluginEffectCategories;
    const plugins = props.plugins || [];
    const query = (params.query as string) || '';
    this.state = {
      category,
      pluginTypes,
      plugins,
      pluginsFiltered: filterPlugins(category, plugins, pluginTypes, query),
      query,
      router: props.router,
    };
  }

  componentDidUpdate(prevProps: any) {
    const paramPrev = prevProps.router.query;
    const params = this.props.router.query;
    if (params.category !== paramPrev.category) {
      this.setState({ category: params.category as string }, () => {
        this.updateFilter();
      });
    }
    if (params.query !== paramPrev.query) {
      this.setState({ query: params.query as string }, () => {
        this.updateFilter();
      });
    }
  }

  updateFilter() {
    this.setState({
      pluginsFiltered: filterPlugins(this.state.category, this.state.plugins, this.state.pluginTypes, this.state.query),
    });
  }

  updateUrl = (category: string, query: string) => {
    this.state.router.push(`/effects?category=${category}&query=${query}`, undefined, { shallow: true });
  };

  handleChange = (event: ChangeEvent) => {
    const el = event.target as HTMLInputElement;
    const query = el.value ? el.value.toLowerCase() : '';
    this.updateUrl(this.state.category, query);
  };

  isSelected = (path: string) => {
    return this.state.category === path ? 'selected' : '';
  };

  selectCategory = (event: React.MouseEvent): void => {
    const category = (event.currentTarget as HTMLTextAreaElement).getAttribute('data-category') || '';
    this.updateUrl(category, this.state.query);
  };

  render() {
    return (
      <Layout>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <section className={styles.plugins}>
          <div className={styles.pluginsHeader}>
            <h3 className={styles.pluginsTitle}>
              Effects <span className={styles.pluginCount}>({this.state.pluginsFiltered.length})</span>
            </h3>
            <input
              className={styles.pluginsSearch}
              placeholder="Filter by keyword"
              type="search"
              value={this.state.query}
              onChange={this.handleChange}
            />
          </div>
          <div className={styles.pluginsCategoryWrapper}>
            <ul className={styles.pluginsCategory}>
              {Object.keys(this.state.pluginTypes).map((projectTypeKey: string, projectTypeIndex: number) => (
                <li key={`${projectTypeKey}-${projectTypeIndex}`}>
                  <a
                    data-category={projectTypeKey}
                    onClick={this.selectCategory}
                    className={this.isSelected(projectTypeKey)}
                  >
                    {this.state.pluginTypes[projectTypeKey].name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.pluginsList}>
            {this.state.pluginsFiltered.map((plugin: PluginInterface, pluginIndex: number) => (
              <GridItem
                section="effects"
                plugin={plugin}
                pluginIndex={pluginIndex}
                key={`${plugin.repo}/${plugin.id}-${pluginIndex}`}
              ></GridItem>
            ))}
          </div>
        </section>
      </Layout>
    );
  }
}
export default withRouter(PluginList);

export const getServerSideProps: GetServerSideProps = async () => {
  const plugins: PluginPack = await pluginsGet('effects');
  const list: PluginInterface[] = [];
  for (const pluginId in plugins) {
    const plugin: PluginLocal = pluginLatest(plugins[pluginId]) as PluginLocal;
    plugin.status = pluginInstalled(plugin) ? 'installed' : 'available';
    list.push(plugin);
  }
  return {
    props: {
      plugins: list,
      pluginsFiltered: list,
    },
  };
};
