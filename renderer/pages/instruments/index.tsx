import { ConfigList, PluginVersion } from '@studiorack/core';
import { useRouter } from 'next/router';
import { filterPlugins } from '../../lib/plugin';
import Layout from '../../components/layout';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { pageTitle } from '../../lib/utils';
import { getCategories } from '../../lib/api-browser';
import { getPlugins } from '../../lib/api';
import List from '../../components/list';

type InstrumentsProps = {
  plugins: PluginVersion[];
};

const Instruments = ({ plugins }: InstrumentsProps) => {
  const router = useRouter();
  const categories: ConfigList = getCategories('instruments');
  const pluginsFiltered: PluginVersion[] = filterPlugins(categories, plugins, router);
  return (
    <Layout>
      <Head>
        <title>{pageTitle(['Instruments'])}</title>
      </Head>
      <List plugins={pluginsFiltered} type="instruments" title="Instruments" />
    </Layout>
  );
};

export default Instruments;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      plugins: await getPlugins('instruments'),
    },
  };
};
