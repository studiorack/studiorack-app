import { useRouter } from 'next/router';
import { filterPresets } from '../../lib/preset';
import Layout from '../../components/layout';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { pageTitle } from '../../lib/utils';
import List from '../../components/list';
import { PackageInterface, RegistryPackages, RegistryType } from '@open-audio-stack/core';
import { managers } from '../../lib/managers';

type PresetsProps = {
  packages: RegistryPackages;
};

const Presets = ({ packages }: PresetsProps) => {
  const router = useRouter();
  const packagesFiltered: PackageInterface[] = filterPresets(router, packages);
  return (
    <Layout>
      <Head>
        <title>{pageTitle(['Presets'])}</title>
      </Head>
      <List items={packagesFiltered} type={RegistryType.Presets} title="Presets" />
    </Layout>
  );
};

export default Presets;

export const getServerSideProps: GetServerSideProps = async () => {
  const manager = managers[RegistryType.Presets];
  await manager.sync();
  manager.scan();
  return {
    props: {
      packages: manager.toJSON(),
    },
  };
};
