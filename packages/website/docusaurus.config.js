module.exports = {
  title: 'Autocomplete',
  tagline: 'JavaScript library for building autocomplete search experiences.',
  url: 'https://autocomplete.algolia.com',
  baseUrl: '/',
  favicon: 'img/logo.png',
  organizationName: 'algolia',
  projectName: 'autocomplete',
  themeConfig: {
    sidebarCollapsible: true,
    navbar: {
      title: 'Autocomplete',
      logo: {
        alt: 'Autocomplete',
        src: 'img/logo.png',
      },
      items: [
        {
          label: 'Docs',
          to: 'docs/introduction',
          position: 'right',
        },
        {
          label: 'API',
          to: 'docs/api',
          position: 'right',
        },
        {
          label: 'Playground',
          to:
<<<<<<< HEAD
            'https://codesandbox.io/s/github/algolia/autocomplete.js/tree/next/examples/js?file=/app.ts',
=======
            'https://codesandbox.io/s/github/algolia/autocomplete.js/tree/next/examples/js?file=/app.tsx',
>>>>>>> d869f075c26862672a96b07093587424216cfe23
          position: 'right',
        },
        {
          href: 'https://github.com/algolia/autocomplete.js/tree/next',
          'aria-label': 'GitHub repository',
          position: 'right',
          className: 'navbar-github-link',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: 'docs/getting-started',
            },
            {
              label: 'API',
              to: 'docs/api',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Issues',
              to: 'https://github.com/algolia/autocomplete.js/issues',
            },
            {
              label: 'Forum',
              href: 'https://discourse.algolia.com/tags/autocomplete',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/tXdr5mP',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'Algolia Blog',
              to: 'https://blog.algolia.com/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/algolia/autocomplete.js/tree/next',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/algolia',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} • Designed and built by Algolia`,
    },
    algolia: {
      indexName: 'autocomplete',
      apiKey: 'a5c3ccfd361b8bcb9708e679c43ae0e5',
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/algolia/autocomplete.js/edit/next/packages/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
