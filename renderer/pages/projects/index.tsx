import { Component, ChangeEvent, MouseEvent, SyntheticEvent } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../../components/layout'
import styles from '../../styles/plugins.module.css'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { withRouter, Router } from 'next/router'
import { Project, projectsGet } from '@studiorack/core'
import { idToSlug } from '../../../node_modules/@studiorack/core/dist/utils'
import { IpcRenderer } from 'electron'

declare global {
  namespace NodeJS {
    interface Global {
      ipcRenderer: IpcRenderer
    }
  }
}

type ProjectListProps = {
  category: string,
  projects: Project[],
  router: Router
}

class ProjectList extends Component<ProjectListProps, {
  category: string,
  projects: Project[]
  projectsFiltered: Project[]
  router: Router
  query: string,
}> {
  list: Project[]

  constructor(props: ProjectListProps) {
    super(props)
    this.state = {
      category: 'all',
      projects: props.projects || [],
      projectsFiltered: props.projects || [],
      router: props.router,
      query: ''
    }
    this.list = props.projects
    if (global && global.ipcRenderer) {
      global.ipcRenderer.invoke('projectsGet').then((projects) => {
        this.list = this.list.concat(projects)
        console.log(this.list)
        this.setState({
          projects: this.list,
          projectsFiltered: this.list
        })
      })
    }
  }

  filterProjects = () => {
    console.log('filterProjects', this.state)
    return this.state.projects.filter((project) => {
      if (
          (
            this.state.category === 'all' ||
            this.state.category === project.type
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
            <li><a data-category="installed" onClick={this.selectCategory} className={this.isSelected('installed')}>Installed</a></li>
            <li><a data-category="available" onClick={this.selectCategory} className={this.isSelected('available')}>Available</a></li>
          </ul>
          <div className={styles.pluginsList}>
            {this.state.projectsFiltered.map((project, projectIndex) => (
              <Link href="/projects/[slug]" as={`/projects/${idToSlug(project.id || '')}`} key={`${project.name}-${projectIndex}`}>
                <div className={styles.plugin}>
                  <div className={styles.pluginDetails}>
                    <div className={styles.pluginHead}>
                      <h4 className={styles.pluginTitle}>{project.name} <span className={styles.pluginVersion}>v{project.version}</span></h4>
                      {project.type === 'installed' ?
                        <span className={styles.pluginButtonInstalled}><img className={styles.pluginButtonIcon} src={`${this.state.router.basePath}/images/icon-installed.svg`} alt="Installed" /></span>
                        :
                        <span className={styles.pluginButton}><img className={styles.pluginButtonIcon} src={`${this.state.router.basePath}/images/icon-download.svg`} alt="Download" /></span>
                      }
                    </div>
                    <ul className={styles.pluginTags}>
                      <img className={styles.pluginIcon} src={`${this.state.router.basePath}/images/icon-tag.svg`} alt="Tags" />
                      {project.tags.map((tag, tagIndex) => (
                        <li className={styles.pluginTag} key={`${tag}-${tagIndex}`}>{tag},</li>
                      ))}
                    </ul>
                  </div>
                  { project.files.image ?
                    <img className={styles.pluginImage} src={`media://${this.getFolder(project.path || 'none')}/${project.files.image.name}`} alt={project.name} onError={this.imageError} />
                    : ""
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

export const getStaticProps: GetStaticProps = async () => {
  const projects = await projectsGet()
  return {
    props: {
      projects
    }
  }
}
