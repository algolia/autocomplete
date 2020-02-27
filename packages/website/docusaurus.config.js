/* eslint-disable import/no-commonjs */

module.exports = {
  title: 'Autocomplete',
  tagline: 'JavaScript library for building autocomplete search experiences.',
  url: 'https://autocomplete-experimental.netlify.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'algolia',
  projectName: 'autocomplete',
  themeConfig: {
    navbar: {
      title: 'Autocomplete',
      logo: {
        alt: 'Autocomplete',
        src: 'img/logo.svg',
      },
      links: [
        {
          to: 'docs/getting-started',
          label: 'Docs',
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
              label: 'Style Guide',
              to: 'docs/doc1',
            },
            {
              label: 'Second Doc',
              to: 'docs/doc2',
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
