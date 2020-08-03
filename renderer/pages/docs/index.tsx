import { Component } from 'react'
import Container from '../../components/container'
import Layout from '../../components/layout'
import styles from '../../styles/doc.module.css'
import { getAllDocs } from '../../lib/api'
import Head from 'next/head'
import Doc from '../../types/doc'
import { withRouter, Router } from 'next/router'

type DocListProps = {
  allDocs: Doc[],
  router: Router
}

class DocList extends Component<DocListProps, {
  allDocs: Doc[]
  router: Router
}> {

  constructor(props: DocListProps) {
    super(props)
    this.state = {
      allDocs: props.allDocs,
      router: props.router
    }
  }

  render() {
    return (
    <>
      <Layout>
        <Head>
          <title>Documentation</title>
        </Head>
        <Container docs={this.state.allDocs}>
          <h1>Getting started</h1>
          <p>System Requirements:</p>
          <ul className={styles.markdownUl}>
            <li className={styles.markdownLi}>Linux, MacOS or Windows</li>
            <li className={styles.markdownLi}>NodeJS 8+</li>
          </ul>
          <p>To install the command line tool, run the command:</p>
          <pre className={styles.markdownPre}>npm install @studiorack/studiorack-cli -g</pre>
          <p>Verify the tool has been installed by running:</p>
          <pre className={styles.markdownPre}>studiorack --version</pre>
          <h2 className={styles.markdownH2}>Music producers</h2>
          <p>Follow our guide on how to start a music project and install plugins:</p>
          <p><a href={`${this.state.router.basePath}/docs/02-create-a-project-config`} className={styles.markdownA}>Create a project config &gt;</a></p>
          <h2 className={styles.markdownH2}>Plugin developers</h2>
          <p>Jump straight to the advanced guide on how to create your own audio plugins:</p>
          <p><a href={`${this.state.router.basePath}/docs/05-develop-new-plugins`} className={styles.markdownA}>Develop new plugins &gt;</a></p>
        </Container>
      </Layout>
    </>
    )
  }
}
export default withRouter(DocList)

export const getStaticProps = async () => {
  const allDocs = getAllDocs([
    'title',
    'slug'
  ])

  return {
    props: { allDocs },
  }
}
