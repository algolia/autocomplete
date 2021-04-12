type Sandbox = {
  name: string;
  tags: string[];
  url: string;
  preview: string | null;
};

export const sandboxes: Sandbox[] = [
  {
    name: 'E-commerce',
    tags: [
      'Recent Searches',
      'Query Suggestions',
      'Algolia',
      'Algolia Insights',
      'Preact',
    ],
    url:
      'https://codesandbox.io/s/github/algolia/autocomplete/tree/next/examples/playground?file=/app.tsx',
    preview: null,
  },
  {
    name: 'GitHub repositories',
    tags: ['Plugin'],
    url:
      'https://codesandbox.io/s/github/algolia/autocomplete/tree/next/examples/github-repositories-custom-plugin?file=/app.tsx',
    preview: null,
  },
  {
    name: 'Query Suggestions',
    tags: ['Query Suggestions'],
    url:
      'https://codesandbox.io/s/github/algolia/autocomplete/tree/next/examples/query-suggestions?file=/app.tsx',
    preview: null,
  },
  {
    name: 'Query Suggestions with categories',
    tags: ['Query Suggestions'],
    url:
      'https://codesandbox.io/s/github/algolia/autocomplete/tree/next/examples/query-suggestions-with-categories?file=/app.tsx',
    preview: null,
  },
  {
    name: 'Query Suggestions with inline categories',
    tags: ['Query Suggestions'],
    url:
      'https://codesandbox.io/s/github/algolia/autocomplete/tree/next/examples/query-suggestions-with-inline-categories?file=/app.tsx',
    preview: null,
  },
  {
    name: 'Query Suggestions with hits',
    tags: ['Query Suggestions'],
    url:
      'https://codesandbox.io/s/github/algolia/autocomplete/tree/next/examples/query-suggestions-with-hits?file=/app.tsx',
    preview: null,
  },
  {
    name: 'Query Suggestions with recent searches',
    tags: ['Query Suggestions', 'Recent searches'],
    url:
      'https://codesandbox.io/s/github/algolia/autocomplete/tree/next/examples/query-suggestions-with-recent-searches?file=/app.tsx',
    preview: null,
  },
  {
    name: 'Recently viewed items',
    tags: ['Plugin'],
    url:
      'https://codesandbox.io/s/github/algolia/autocomplete/tree/next/examples/recently-viewed-items?file=/app.tsx',
    preview: null,
  },
  {
    name: 'React renderer',
    tags: ['Algolia', 'React', 'Renderer'],
    url:
      'https://codesandbox.io/s/github/algolia/autocomplete/tree/next/examples/react-renderer?file=/src/Autocomplete.tsx',
    preview: null,
  },
];
