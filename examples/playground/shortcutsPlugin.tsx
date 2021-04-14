import { AutocompletePlugin } from '@algolia/autocomplete-js';

import { toggleTheme, isDarkThemeSelected } from './darkMode';

type DarkModeItem = {
  label: string;
};

export const shortcutsPlugin: AutocompletePlugin<DarkModeItem, undefined> = {
  getSources({ query }) {
    if (query !== '/' && query !== 'dark' && query !== 'light') {
      return [];
    }

    return [
      {
        sourceId: 'shortcutsPlugin',
        getItems() {
          return [
            {
              label: 'Toggle dark mode',
            },
          ];
        },
        onSelect({ setIsOpen, setQuery, refresh }) {
          toggleTheme();
          setQuery('');
          setIsOpen(true);
          refresh();
        },
        templates: {
          header({ createElement, Fragment }) {
            return createElement(
              Fragment,
              {},
              createElement(
                'span',
                { className: 'aa-SourceHeaderTitle' },
                'Shortcuts'
              ),
              createElement('div', { className: 'aa-SourceHeaderLine' })
            );
          },
          item({ item, createElement }) {
            const darkIcon = createElement(
              'svg',
              {
                xmlns: 'http://www.w3.org/2000/svg',
                fill: 'none',
                viewBox: '0 0 24 24',
                stroke: 'currentColor',
              },
              createElement('path', {
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeWidth: 2,
                d:
                  'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
              })
            );
            const lightIcon = createElement(
              'svg',
              {
                xmlns: 'http://www.w3.org/2000/svg',
                fill: 'none',
                viewBox: '0 0 24 24',
                stroke: 'currentColor',
              },
              createElement('path', {
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeWidth: 2,
                d:
                  'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
              })
            );

            return createElement(
              'div',
              { className: 'aa-ItemWrapper' },
              createElement(
                'div',
                { className: 'aa-ItemContent' },
                createElement(
                  'div',
                  { className: 'aa-ItemIcon' },
                  isDarkThemeSelected() ? lightIcon : darkIcon
                ),
                createElement(
                  'div',
                  { className: 'aa-ItemContentBody' },
                  createElement(
                    'div',
                    { className: 'aa-ItemContentTitle' },
                    item.label
                  )
                )
              )
            );
          },
        },
      },
    ];
  },
};
