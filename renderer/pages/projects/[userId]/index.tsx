import { Component } from 'react';
import Head from 'next/head';
import Layout from '../../../components/layout';
import { pageTitle } from '../../../lib/utils';
import List from '../../../components/list';
import { PackageInterface, RegistryPackages, RegistryType } from '@open-audio-stack/core';
import { managers } from '../../../lib/managers';

type PluginListProps = {
  packagesFiltered: PackageInterface[];
  userId: string;
};

class PluginList extends Component<
  PluginListProps,
  {
    packagesFiltered: PackageInterface[];
    query: string;
    userId: string;
  }
> {
  constructor(props: PluginListProps) {
    super(props);
    this.state = {
      packagesFiltered: props.packagesFiltered || [],
      query: '',
      userId: props.userId,
    };
  }

  render() {
    return (
      <Layout>
        <Head>
          <title>{pageTitle(['Projects', this.state.userId])}</title>
        </Head>
        <List
          items={this.state.packagesFiltered}
          type={RegistryType.Projects}
          title={this.state.userId}
          filters={false}
        />
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
  const manager = managers[RegistryType.Projects];
  await manager.sync();
  manager.scan();
  const packages: RegistryPackages = manager.toJSON();
  const packagesFiltered: PackageInterface[] = [];
  for (const slug in packages) {
    if (slug.split('/')[0] === params.userId) {
      packagesFiltered.push(packages[slug]);
    }
  }
  return {
    props: {
      packagesFiltered,
      userId: params.userId,
    },
  };
}
