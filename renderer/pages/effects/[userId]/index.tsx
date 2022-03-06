import { Component } from 'react';
import Head from 'next/head';
import Crumb from '../../../components/crumb';
import Layout, { siteTitle } from '../../../components/layout';
import styles from '../../../styles/plugins.module.css';
import GridItem from '../../../components/grid-item';
import { pluginInstalled, PluginInterface, pluginLatest, PluginLocal, pluginsGet } from '@studiorack/core';

type PluginListProps = {
  plugins: PluginInterface[];
  userId: string;
};

class PluginList extends Component<
  PluginListProps,
  {
    pluginsFiltered: PluginInterface[];
    query: string;
    userId: string;
  }
> {
  constructor(props: PluginListProps) {
    super(props);
    this.state = {
      pluginsFiltered: props.plugins || [],
      query: '',
      userId: props.userId,
    };
  }

  render() {
    return (
      <Layout>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <section className={styles.plugins}>
          <Crumb items={['effects']}></Crumb>
          <h2>{this.state.userId}</h2>
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
export default PluginList;

type Params = {
  params: {
    userId: string;
  };
};

export async function getServerSideProps({ params }: Params) {
  const plugins = await pluginsGet('effects');
  const list: PluginInterface[] = [];
  for (const pluginId in plugins) {
    const plugin: PluginLocal = pluginLatest(plugins[pluginId]) as PluginLocal;
    plugin.status = pluginInstalled(plugin) ? 'installed' : 'available';
    console.log(plugin.repo.split('/')[0], params.userId);
    if (plugin.repo.split('/')[0] === params.userId) {
      list.push(plugin);
    }
  }
  return {
    props: {
      plugins: list,
      userId: params.userId,
    },
  };
}
