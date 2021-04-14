/* eslint-disable import/no-commonjs */

type ShowcaseProject = {
  name: string;
  description: string;
  url: string;
  preview: string;
};

export const showcase: ShowcaseProject[] = [
  {
    name: 'DocSearch',
    description:
      'The best search experience for docs, integrates in minutes, for free',
    url: 'https://docsearch.algolia.com',
    preview: require('./docsearch.png').default,
  },
  {
    name: 'Algolia Documentation',
    description: 'Algolia Search API Documentation, Guides, Tutorials and FAQs',
    url: 'https://algolia.com/doc',
    preview: require('./algolia-documentation.png').default,
  },
];
