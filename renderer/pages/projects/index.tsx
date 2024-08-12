import { Component, ChangeEvent } from 'react';
import Head from 'next/head';
import { withRouter, Router } from 'next/router';
import Layout, { siteTitle } from '../../components/layout';
import styles from '../../styles/plugins.module.css';
import GridItem from '../../components/grid-item';
import { GetServerSideProps } from 'next';
import { ProjectVersionLocal, ProjectTypes } from '@studiorack/core';
import { projectsGetLocal } from '../../../node_modules/@studiorack/core/build/project';
import { configDefaults } from '../../../node_modules/@studiorack/core/build/config-defaults';
import { filterProjects } from '../../lib/project';

type ProjectListProps = {
  category: string;
  projectTypes: ProjectTypes;
  projects: ProjectVersionLocal[];
  projectsFiltered: ProjectVersionLocal[];
  query: string;
  router: Router;
};

class ProjectList extends Component<
  ProjectListProps,
  {
    category: string;
    projectTypes: ProjectTypes;
    projects: ProjectVersionLocal[];
    projectsFiltered: ProjectVersionLocal[];
    query: string;
    router: Router;
  }
> {
  constructor(props: ProjectListProps) {
    super(props);
    const params = props.router.query;
    const category = (params.category as string) || 'all';
    const projectTypes = configDefaults('appFolder', 'pluginFolder', 'presetFolder', 'projectFolder').projectTypes;
    const projects = props.projects || [];
    const query = (params.query as string) || '';
    this.state = {
      category,
      projectTypes,
      projects,
      projectsFiltered: filterProjects(category, projects, projectTypes, query),
      query,
      router: props.router,
    };
  }

  componentDidUpdate(prevProps: any) {
    const paramPrev = prevProps.router.query;
    const params = this.props.router.query;
    if (params.category !== paramPrev.category) {
      this.setState({ category: params.category as string }, () => {
        this.updateFilter();
      });
    }
    if (params.query !== paramPrev.query) {
      this.setState({ query: params.query as string }, () => {
        this.updateFilter();
      });
    }
  }

  updateFilter() {
    this.setState({
      projectsFiltered: filterProjects(
        this.state.category,
        this.state.projects,
        this.state.projectTypes,
        this.state.query,
      ),
    });
  }

  updateUrl = (category: string, query: string) => {
    this.state.router.push(`/projects?category=${category}&query=${query}`, undefined, { shallow: true });
  };

  handleChange = (event: ChangeEvent) => {
    const el = event.target as HTMLInputElement;
    const query = el.value ? el.value.toLowerCase() : '';
    this.updateUrl(this.state.category, query);
  };

  isSelected = (path: string) => {
    return this.state.category === path ? 'selected' : '';
  };

  selectCategory = (event: React.MouseEvent): void => {
    const category = (event.currentTarget as HTMLTextAreaElement).getAttribute('data-category') || '';
    this.updateUrl(category, this.state.query);
  };

  render() {
    return (
      <Layout>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <section className={styles.plugins}>
          <div className={styles.pluginsHeader}>
            <h3 className={styles.pluginsTitle}>
              Projects <span className={styles.pluginCount}>({this.state.projectsFiltered.length})</span>
            </h3>
            <input
              className={styles.pluginsSearch}
              placeholder="Filter by keyword"
              type="search"
              value={this.state.query}
              onChange={this.handleChange}
            />
          </div>
          <div className={styles.pluginsCategoryWrapper}>
            <ul className={styles.pluginsCategory}>
              <li>
                <a data-category="all" onClick={this.selectCategory} className={this.isSelected('all')}>
                  All
                </a>
              </li>
              {Object.keys(this.state.projectTypes).map((projectTypeKey: string, projectTypeIndex: number) => (
                <li key={`${projectTypeKey}-${projectTypeIndex}`}>
                  <a
                    data-category={projectTypeKey}
                    onClick={this.selectCategory}
                    className={this.isSelected(projectTypeKey)}
                  >
                    {this.state.projectTypes[projectTypeKey].name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.pluginsList}>
            {this.state.projectsFiltered.map((project: ProjectVersionLocal, projectIndex: number) => (
              <GridItem
                section="projects"
                plugin={project}
                pluginIndex={projectIndex}
                key={`${project.id}-${projectIndex}`}
              ></GridItem>
            ))}
          </div>
        </section>
      </Layout>
    );
  }
}
export default withRouter(ProjectList);

export const getServerSideProps: GetServerSideProps = async () => {
  let projects = await projectsGetLocal();
  projects = projects.sort(function (a: ProjectVersionLocal, b: ProjectVersionLocal) {
    return a.name.localeCompare(b.name);
  });
  return {
    props: {
      projects,
      projectsFiltered: projects,
    },
  };
};
