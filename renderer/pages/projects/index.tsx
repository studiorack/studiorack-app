import { Component, ChangeEvent, MouseEvent, SyntheticEvent } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../../components/layout'
import styles from '../../styles/plugins.module.css'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { withRouter, Router } from 'next/router'
import { configGet, configSet, ProjectLocal, projectsGetLocal, ProjectType, ProjectTypes } from '@studiorack/core'
import { idToSlug } from '../../../node_modules/@studiorack/core/dist/utils'
import { IpcRenderer } from 'electron'
import { store } from '../../../electron-src/store';

declare global {
  namespace NodeJS {
    interface Global {
      ipcRenderer: IpcRenderer
    }
  }
}

type ProjectListProps = {
  category: string,
  projects: ProjectLocal[],
  projectTypes: { [property: string]: ProjectType },
  router: Router
}

class ProjectList extends Component<ProjectListProps, {
  category: string,
  projects: ProjectLocal[],
  projectsFiltered: ProjectLocal[],
  projectTypes: { [property: string]: ProjectType },
  router: Router,
  query: string,
}> {
  list: ProjectLocal[]

  constructor(props: ProjectListProps) {
    super(props)
    this.state = {
      category: 'all',
      projects: props.projects || [],
      projectsFiltered: props.projects || [],
      projectTypes: props.projectTypes,
      router: props.router,
      query: ''
    }
    this.list = props.projects
  }

  filterProjects = () => {
    console.log('filterProjects', this.state)
    return this.state.projects.filter((project) => {
      if (
          (
            this.state.category === 'all' ||
            this.state.category === project.type?.ext
          )
          &&
          (
            project.name.toLowerCase().indexOf(this.state.query) !== -1 ||
            project.description.toLowerCase().indexOf(this.state.query) !== -1 ||
            project.tags.includes(this.state.query)
          )) {
        return project
      }
      return false
    })
  }

  handleChange = (event: ChangeEvent) => {
    const el = event.target as HTMLInputElement
    const query = el.value ? el.value.toLowerCase() : ''
    this.setState({ query: query }, () => {
      this.setState({ projectsFiltered: this.filterProjects() })
    })
  }

  isSelected = (path: string) => {
    return this.state.category === path ? 'selected' : ''
  }

  selectCategory = (event: MouseEvent) => {
    const category = event.currentTarget.getAttribute('data-category') || ''
    this.setState({ category: category }, () => {
      this.setState({ projectsFiltered: this.filterProjects() })
    })
  }

  imageError = (event: SyntheticEvent) => {
    const el = event.target as HTMLImageElement
    const fallback = `${this.state.router.basePath}/images/project.png`
    if (el.getAttribute('src') !== fallback) {
      el.setAttribute('src', fallback)
    }
    return undefined
  }

  getFolder(path: string) {
    return path.slice(0, path.lastIndexOf('/'));
  }

  render() {
    return (
      <Layout>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <section className={styles.plugins}>
          <div className={styles.pluginsHeader}>
            <h3 className={styles.pluginsTitle}>Projects <span className={styles.pluginCount}>({this.state.projectsFiltered.length})</span></h3>
            <input className={styles.pluginsSearch} placeholder="Filter by keyword" value={this.state.query} onChange={this.handleChange} />
          </div>
          <ul className={styles.pluginsCategory}>
            <li><a data-category="all" onClick={this.selectCategory} className={this.isSelected('all')}>All</a></li>
            {Object.keys(this.state.projectTypes).map((projectKey, projectIndex) => (
              <li><a key={`${projectKey}-${projectIndex}`} data-category={this.state.projectTypes[projectKey].ext} onClick={this.selectCategory} className={this.isSelected(this.state.projectTypes[projectKey].ext)}>{this.state.projectTypes[projectKey].name}</a></li>
            ))}
          </ul>
          <div className={styles.pluginsList}>
            {this.state.projectsFiltered.map((project: ProjectLocal, projectIndex: number) => (
              <Link href="/projects/[slug]" as={`/projects/${idToSlug(project.repo + '/' + project.id)}`} key={`${idToSlug(project.repo + '/' + project.id)}-${projectIndex}`}>
                <div className={styles.plugin}>
                  <div className={styles.pluginDetails}>
                    <div className={styles.pluginHead}>
                      <h4 className={styles.pluginTitle}>{project.name} <span className={styles.pluginVersion}>v{project.version}</span></h4>
                      { project.type && project.type.ext ?
                        <span className={styles.projectButton}><img className={styles.projectButtonIcon} src={`${this.state.router.basePath}/icons/icon-${project.type.ext}.png`} alt={project.type.name} /></span>
                        : ''
                      }
                    </div>
                    <ul className={styles.pluginTags}>
                      <img className={styles.pluginIcon} src={`${this.state.router.basePath}/images/icon-tag.svg`} alt="Tags" />
                      {project.tags.map((tag: string) => (
                        <li className={styles.pluginTag} key={`${tag}-${projectIndex}`}>{tag},</li>
                      ))}
                    </ul>
                  </div>
                  { project.files.image && project.files.image.size ?
                    <img className={styles.pluginImage} src={`media://${this.getFolder(project.path || 'none')}/${project.files.image.name}`} alt={project.name} onError={this.imageError} />
                    :
                    <img className={styles.pluginImage} src={`${this.state.router.basePath}/images/project.png`} alt={project.name} onError={this.imageError} />
                  }
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Layout>
    )
  }
}
export default withRouter(ProjectList)

export const getServerSideProps: GetServerSideProps = async () => {
  configSet('projectFolder', store.get('projectFolder'));
  const projects = await projectsGetLocal()
  const projectTypesFound: { [property: string]: boolean } = {};
  projects.sort((a: ProjectLocal, b: ProjectLocal) => {
    if (a.type?.ext) projectTypesFound[a.type?.ext] = true
    if (b.type?.ext) projectTypesFound[b.type?.ext] = true
    return a.date < b.date ? 1 : -1
  })
  const projectTypesFiltered: { [property: string]: ProjectType } = {};
  const projectTypes: ProjectTypes = configGet('projectTypes');
  Object.keys(projectTypes).forEach((projectKey: string) => {
    const projectType: ProjectType = projectTypes[projectKey as keyof ProjectTypes];
    if (projectTypesFound[projectType.ext]) {
      projectTypesFiltered[projectKey] = projectTypes[projectKey as keyof ProjectTypes];
    }
  })
  return {
    props: {
      projects,
      projectsFiltered: projects,
      projectTypes: projectTypesFiltered
    }
  }
}
