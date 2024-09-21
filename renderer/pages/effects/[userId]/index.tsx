import { Component } from 'react';
import Head from 'next/head';
import Layout from '../../../components/layout';
import { PluginVersion, PluginPack, pluginsGet } from '@studiorack/core';
import { getPlugin } from '../../../lib/plugin';
import { pageTitle } from '../../../lib/utils';
import List from '../../../components/list';

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
          <title>{pageTitle(['Effects', this.state.userId])}</title>
        </Head>
        <List filters={false} plugins={this.state.pluginsFiltered} type="effects" title={this.state.userId} />
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
  const pluginPack: PluginPack = await pluginsGet('effects');
  const plugins: PluginVersion[] = [];
  for (const pluginId in pluginPack) {
    if (pluginId.split('/')[0] === params.userId) {
      plugins.push(getPlugin(pluginPack, pluginId));
    }
  }
  return {
    props: {
      plugins,
      userId: params.userId,
    },
  };
}
