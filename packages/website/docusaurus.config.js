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
          label: 'Playground',
          to:
            'https://codesandbox.io/s/github/algolia/autocomplete/tree/next/examples/playground?file=/app.tsx',
          position: 'right',
        },
        {
          href: 'https://github.com/algolia/autocomplete',
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
              to: 'https://github.com/algolia/autocomplete/issues',
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
              href: 'https://github.com/algolia/autocomplete',
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
            'https://github.com/algolia/autocomplete/edit/next/packages/website/',
        },
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
            require.resolve('@algolia/autocomplete-theme-classic'),
          ],
        },
      },
    ],
  ],
};
