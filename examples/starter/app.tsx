import { autocomplete } from '@algolia/autocomplete-js';

import '@algolia/autocomplete-theme-classic';

autocomplete({
  container: '#autocomplete',
  getSources() {
    return [
      {
        sourceId: 'links',
        getItems({ query }) {
          const items = [
            { label: 'Twitter', url: 'https://twitter.com' },
            { label: 'GitHub', url: 'https://github.com' },
          ];

          return items.filter(({ label }) =>
            label.toLowerCase().includes(query.toLowerCase())
          );
        },
        getItemUrl({ item }) {
          return item.url;
        },
        templates: {
          item({ item }) {
            return item.label;
          },
        },
      },
    ];
  },
});
