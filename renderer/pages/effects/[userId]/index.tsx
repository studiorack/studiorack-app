import { Component, ChangeEvent } from 'react';
import Head from 'next/head';
import Crumb from '../../../components/crumb';
import Layout, { siteTitle } from '../../../components/layout';
import styles from '../../../styles/plugins.module.css';
import GridItem from '../../../components/grid-item';
import { PluginVersion, pluginsGet, PluginVersionLocal, pluginInstalled } from '@studiorack/core';
import { getPlugin } from '../../../lib/plugin';

type PluginListProps = {
  plugins: PluginVersion[];
  userId: string;
};

class PluginList extends Component<
  PluginListProps,
  {
    pluginsFiltered: PluginVersion[];
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
            {this.state.pluginsFiltered.map((plugin: PluginVersion, pluginIndex: number) => (
              <GridItem
                section="effects"
                plugin={plugin}
                pluginIndex={pluginIndex}
                key={`${plugin.id}-${pluginIndex}`}
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
  const pluginPack = await pluginsGet('effects');
  const list: PluginVersion[] = [];
  for (const pluginId in pluginPack) {
    const plugin: PluginVersionLocal = getPlugin(pluginPack, pluginId) as PluginVersionLocal;
    plugin.status = pluginInstalled(plugin) ? 'installed' : 'available';
    console.log(plugin.id?.split('/')[0], params.userId);
    if (plugin.id?.split('/')[0] === params.userId) {
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
