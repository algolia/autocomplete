module.exports = {
  title: 'Autocomplete',
  tagline: 'JavaScript library for building autocomplete search experiences.',
  url: 'https://algolia-autocomplete.netlify.app',
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
          to: 'docs/getting-started',
          label: 'Docs',
          position: 'right',
        },
        {
          label: 'API',
          type: 'doc',
          docId: 'createAutocomplete',
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
              to: 'docs/createAutocomplete',
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
