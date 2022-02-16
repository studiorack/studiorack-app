import { Component } from 'react';
import Head from 'next/head';
import Crumb from '../../../../components/crumb';
import Layout, { siteTitle } from '../../../../components/layout';
import styles from '../../../../styles/plugins.module.css';
import GridItem from '../../../../components/grid-item';
import { PluginInterface, pluginLatest, pluginsGet } from '@studiorack/core';

type PluginListProps = {
  plugins: PluginInterface[];
  repoId: string;
  userId: string;
};

class PluginList extends Component<
  PluginListProps,
  {
    pluginsFiltered: PluginInterface[];
    query: string;
    repoId: string;
    userId: string;
  }
> {
  constructor(props: PluginListProps) {
    super(props);
    this.state = {
      pluginsFiltered: props.plugins || [],
      query: '',
      repoId: props.repoId,
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
          <Crumb items={['effects', this.state.userId]}></Crumb>
          <h2>{this.state.repoId}</h2>
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
    repoId: string;
    userId: string;
  };
};

export async function getServerSideProps({ params }: Params) {
  const plugins = await pluginsGet('effects');
  const list: PluginInterface[] = [];
  for (const pluginId in plugins) {
    const plugin: PluginInterface = pluginLatest(plugins[pluginId]);
    if (plugin.repo === `${params.userId}/${params.repoId}`) {
      list.push(plugin);
    }
  }
  return {
    props: {
      plugins: list,
      repoId: params.repoId,
      userId: params.userId,
    },
  };
}
