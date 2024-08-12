import { Component } from 'react';
import SubNav from '../../components/subnav';
import Layout from '../../components/layout';
import styles from '../../styles/doc.module.css';
import { getAllDocs } from '../../lib/api';
import Head from 'next/head';
import Doc from '../../types/doc';
import { withRouter, Router } from 'next/router';

type DocListProps = {
  allDocs: Doc[];
  router: Router;
};

class DocList extends Component<
  DocListProps,
  {
    allDocs: Doc[];
    router: Router;
  }
> {
  constructor(props: DocListProps) {
    super(props);
    this.state = {
      allDocs: props.allDocs,
      router: props.router,
    };
  }

  render() {
    return (
      <>
        <Layout>
          <Head>
            <title>Documentation</title>
          </Head>
          <SubNav docs={this.state.allDocs}>
            <h1>Getting started</h1>
            <p>
              You can use StudioRack features via the website, app or command line tool. This guide is for the command
              line tool.
            </p>
            <p>System Requirements:</p>
            <ul className={styles.markdownUl}>
              <li className={styles.markdownLi}>Linux, MacOS or Windows</li>
              <li className={styles.markdownLi}>NodeJS 18+</li>
            </ul>
            <p>To install the command line tool, run the command:</p>
            <pre className={styles.markdownPre}>npm install @studiorack/cli -g</pre>
            <p>Verify the tool has been installed by running:</p>
            <pre className={styles.markdownPre}>studiorack --version</pre>
            <p>From here the guide has two pathways, choose the path which best aligns with your objectives.</p>
            <h2 className={styles.markdownH2}>Music producers</h2>
            <p>Easy plugin installation &amp; management:</p>
            <p>
              <a href={`${this.state.router.basePath}/docs/02-create-a-project-config`} className={styles.markdownA}>
                Create a project config &gt;
              </a>
            </p>
            <h2 className={styles.markdownH2}>Plugin developers</h2>
            <p>Automate your plugin publishing workflow</p>
            <p>
              <a href={`${this.state.router.basePath}/docs/05-develop-new-plugins`} className={styles.markdownA}>
                Develop new plugins &gt;
              </a>
            </p>
          </SubNav>
        </Layout>
      </>
    );
  }
}
export default withRouter(DocList);

export const getServerSideProps = async () => {
  const allDocs = getAllDocs(['title', 'slug']);

  return {
    props: { allDocs },
  };
};
