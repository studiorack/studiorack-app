import { Component } from 'react'
import Doc from '../types/doc'
import styles from '../styles/docs.module.css'
import { withRouter, Router } from 'next/router'

type ContainerProps = {
  children: React.ReactNode,
  docs: Doc[],
  router: Router
}

class Container extends Component<{
  children: React.ReactNode,
  docs: Doc[],
  router: Router
}, {
  children: React.ReactNode
  docs: Doc[]
  router: Router
}> {

  constructor(props: ContainerProps) {
    super(props)
    this.state = {
      children: props.children,
      docs: props.docs.filter(doc => doc.slug !== '06-command-line'),
      router: props.router
    }
  }

  isSelected = (path: string) => {
    if (path === '/') {
      return this.state.router.asPath === path ? 'active': ''
    }
    return this.state.router.asPath.startsWith(path) ? 'active': ''
  }

  render() {
    return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h4>Documentation</h4>
        <ul className={styles.menu}>
          {this.state.docs.map((doc) => (
            <li className={styles.menuItem} key={doc.slug}><a href={`${this.state.router.basePath}/docs/${doc.slug}`} className={this.isSelected(`/docs/${doc.slug}`)}>{doc.title}</a></li>
          ))}
        </ul>
        <h4>API Reference</h4>
        <ul className={styles.menu}>
          <li className={styles.menuItem} key="06-command-line"><a href={`${this.state.router.basePath}/docs/06-command-line`} className={this.isSelected(`/docs/06-command-line`)}>Command line</a></li>
        </ul>
      </div>
      <div className={styles.content}>
        {this.state.children}
      </div>
    </div>
    )
  }
}
export default withRouter(Container)
