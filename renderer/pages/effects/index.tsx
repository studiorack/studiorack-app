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

type EffectsProps = {
  plugins: PluginVersion[];
};

const Effects = ({ plugins }: EffectsProps) => {
  const router = useRouter();
  const categories: ConfigList = getCategories('effects');
  const pluginsFiltered: PluginVersion[] = filterPlugins(categories, plugins, router);
  return (
    <Layout>
      <Head>
        <title>{pageTitle(['Effects'])}</title>
      </Head>
      <List plugins={pluginsFiltered} type="effects" title="Effects" />
    </Layout>
  );
};

export default Effects;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      plugins: await getPlugins('effects'),
    },
  };
};
