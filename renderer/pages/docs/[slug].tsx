import { Component } from 'react';
import Container from '../../components/container';
import Layout from '../../components/layout';
import { getDocBySlug, getAllDocs } from '../../lib/api';
import Doc from '../../types/doc';
import markdownStyles from '../../styles/doc.module.css';
import remark from 'remark';
import html from 'remark-html';
import { withRouter, Router } from 'next/router';

type DocProps = {
  allDocs: Doc[];
  doc: Doc;
  router: Router;
};

class DocPage extends Component<
  DocProps,
  {
    allDocs: Doc[];
    doc: Doc;
    router: Router;
  }
> {
  constructor(props: DocProps) {
    super(props);
    this.state = {
      allDocs: props.allDocs,
      doc: props.doc,
      router: props.router,
    };
  }

  convertToSlug(text: string) {
    return text
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }

  render() {
    let content = this.state.doc.content.replace('/docs', `${this.state.router.basePath}/docs`);
    content = content.replace(
      /<h2>(.*?)<\/h2>/g,
      (tag, title) => `<span id="${this.convertToSlug(title)}"></span>${tag}`
    );
    return (
      <Layout>
        <Container docs={this.state.allDocs}>
          <h1>{this.state.doc.title}</h1>
          <div className={markdownStyles.markdown} dangerouslySetInnerHTML={{ __html: content }} />
        </Container>
      </Layout>
    );
  }
}
export default withRouter(DocPage);

type Params = {
  params: {
    slug: string;
  };
};

async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export async function getStaticProps({ params }: Params) {
  const allDocs = getAllDocs(['title', 'slug']);

  const doc = getDocBySlug(params.slug, ['title', 'slug', 'content']) as Doc;
  const content = await markdownToHtml(doc.content || '');

  return {
    props: {
      allDocs,
      doc: {
        ...doc,
        content,
      },
    },
  };
}

export async function getStaticPaths() {
  const docs = getAllDocs(['slug']) as Doc[];

  return {
    paths: docs.map((doc) => {
      return {
        params: {
          slug: doc.slug,
        },
      };
    }),
    fallback: false,
  };
}
