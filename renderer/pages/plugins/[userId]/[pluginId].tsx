import { Component } from 'react';
import Layout from '../../../components/layout';
import Head from 'next/head.js';
import { withRouter, Router } from 'next/router.js';
import { pageTitle } from '../../../lib/utils';
import Details from '../../../components/details';
import {
  Package,
  PackageFileMap,
  packageFileMap,
  PackageInterface,
  PackageVersion,
  RegistryType,
} from '@open-audio-stack/core';
import { managers } from '../../../lib/managers';

declare global {
  interface Window {
    Sfz: any;
  }
}

type PluginProps = {
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
          <title>{pageTitle(['Plugins', this.state.pkgVersion.name])}</title>
          <meta name="description" content={this.state.pkgVersion.description || ''} />
          <meta name="og:image" content={this.state.pkgVersion.image} />
          <meta name="og:title" content={this.state.pkgVersion.name || ''} />
        </Head>
        <Details
          downloads={this.state.downloads}
          pkg={this.state.pkg}
          pkgVersion={this.state.pkgVersion}
          type={RegistryType.Plugins}
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
  const manager = managers[RegistryType.Plugins];
  await manager.sync();
  manager.scan();
  const pkg: Package | undefined = manager.getPackage(`${params.userId}/${params.pluginId}`);
  return {
    props: {
      pkg: pkg?.toJSON(),
    },
  };
}
