import { configDefaults, projectsGetLocal, ProjectVersion, ProjectVersionLocal } from '@studiorack/core';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { pageTitle } from '../../lib/utils';
import List from '../../components/list';
import { filterProjects } from '../../lib/project';

type ProjectsProps = {
  projects: ProjectVersion[];
};

const Projects = ({ projects }: ProjectsProps) => {
  const router = useRouter();
  const projectTypes = configDefaults('appFolder', 'pluginFolder', 'presetFolder', 'projectFolder').projectTypes;
  const projectsFiltered: ProjectVersion[] = filterProjects(projectTypes, projects, router);
  return (
    <Layout>
      <Head>
        <title>{pageTitle(['Projects'])}</title>
      </Head>
      <List items={projectsFiltered} type="projects" title="Projects" filters={false} tabs={projectTypes} />
    </Layout>
  );
};

export default Projects;

export const getServerSideProps: GetServerSideProps = async () => {
  let projects = await projectsGetLocal();
  projects = projects.sort(function (a: ProjectVersionLocal, b: ProjectVersionLocal) {
    return a.name.localeCompare(b.name);
  });
  return {
    props: {
      projects,
    },
  };
};
