import { Component } from 'react';
import Layout from '../../../components/layout';
import Head from 'next/head.js';
import { withRouter, Router } from 'next/router.js';
import { pageTitle } from '../../../lib/utils';
import Details from '../../../components/details';
import {
  ManagerLocal,
  Package,
  packageFileMap,
  PackageFileMap,
  PackageInterface,
  PackageVersion,
  RegistryType,
} from '@open-audio-stack/core';

declare global {
  interface Window {
    Sfz: any;
  }
}

type PluginProps = {
  downloads: PackageFileMap;
  pkg: PackageInterface;
  pkgVersion: PackageVersion;
  router: Router;
};

class PluginPage extends Component<
  PluginProps,
  {
    downloads: PackageFileMap;
    pkg: PackageInterface;
    pkgVersion: PackageVersion;
    router: Router;
  }
> {
  constructor(props: PluginProps) {
    super(props);
    this.state = {
      downloads: packageFileMap(props.pkg.versions[props.pkg.version]),
      pkg: props.pkg,
      pkgVersion: props.pkg.versions[props.pkg.version],
      router: props.router,
    };
  }

  render() {
    return (
      <Layout>
        <Head>
          <title>{pageTitle(['Projects', this.state.pkgVersion.name])}</title>
          <meta name="description" content={this.state.pkgVersion.description || ''} />
          <meta name="og:image" content={this.state.pkgVersion.image} />
          <meta name="og:title" content={this.state.pkgVersion.name || ''} />
        </Head>
        <Details
          downloads={this.state.downloads}
          pkg={this.state.pkg}
          pkgVersion={this.state.pkgVersion}
          type={RegistryType.Projects}
        />
      </Layout>
    );
  }
}
export default withRouter(PluginPage);

type Params = {
  params: {
    pluginId: string;
    userId: string;
  };
};

export async function getServerSideProps({ params }: Params) {
  const manager = new ManagerLocal(RegistryType.Projects);
  await manager.sync();
  manager.scan();
  const pkg: Package | undefined = manager.getPackage(`${params.userId}/${params.pluginId}`);
  return {
    props: {
      pkg: pkg?.toJSON(),
    },
  };
}
