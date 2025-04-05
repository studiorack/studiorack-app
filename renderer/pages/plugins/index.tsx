import { useRouter } from 'next/router';
import { filterPlugins } from '../../lib/plugin';
import Layout from '../../components/layout';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { pageTitle } from '../../lib/utils';
import List from '../../components/list';
import { PackageInterface, RegistryPackages, RegistryType } from '@open-audio-stack/core';
import { managers } from '../../lib/managers';

type PluginsProps = {
  packages: RegistryPackages;
};

const Plugins = ({ packages }: PluginsProps) => {
  const router = useRouter();
  const packagesFiltered: PackageInterface[] = filterPlugins(router, packages);
  return (
    <Layout>
      <Head>
        <title>{pageTitle(['Plugins'])}</title>
      </Head>
      <List items={packagesFiltered} type={RegistryType.Plugins} title="Plugins" />
    </Layout>
  );
};

export default Plugins;

export const getServerSideProps: GetServerSideProps = async () => {
  const manager = managers[RegistryType.Plugins];
  await manager.sync();
  manager.scan();
  return {
    props: {
      packages: manager.toJSON(),
    },
  };
};
