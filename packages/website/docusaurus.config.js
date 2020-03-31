/* eslint-disable import/no-commonjs */

module.exports = {
  title: 'Autocomplete',
  tagline: 'JavaScript library for building autocomplete search experiences.',
  url: 'https://autocomplete-experimental.netlify.com',
  baseUrl: '/',
  favicon: 'img/logo.png',
  organizationName: 'algolia',
  projectName: 'autocomplete',
  themeConfig: {
    sidebarCollapsible: false,
    navbar: {
      title: 'Autocomplete',
      logo: {
        alt: 'Autocomplete',
        src: 'img/logo.png',
      },
      links: [
        {
          to: 'docs/getting-started',
          label: 'Docs',
          position: 'right',
        },
        {
          href: 'https://autocomplete-experimental.netlify.com/stories',
          label: 'Stories',
          position: 'right',
        },
        {
          href: 'https://github.com/francoischalifour/autocomplete.js',
          label: 'GitHub',
          position: 'right',
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
              to: 'https://github.com/francoischalifour/autocomplete.js/issues',
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
              href: 'https://github.com/francoischalifour/autocomplete.js',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docsearch_',
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
            'https://github.com/francoischalifour/autocomplete.js/edit/next/packages/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
