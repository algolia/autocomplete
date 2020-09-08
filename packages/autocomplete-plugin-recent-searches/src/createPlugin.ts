import { createRecentSearches } from './createRecentSearches';

type Plugin = {
  getSources: Function;
  onSubmit: Function;
  onSelect: Function;
};

type CreatePlugin = (options?: any) => Plugin;

export const createPlugin: CreatePlugin = ({ limit = 5 } = {}) => {
  const recentSearches = createRecentSearches({
    key: 'RECENT_SEARCHES',
    limit,
  });

  return {
    getSources: ({ query }) => {
      return [
        !query && {
          getInputValue: ({ suggestion }) => suggestion.query,
          getSuggestions() {
            return recentSearches.getAll();
          },
          onSelect({ suggestion }) {
            recentSearches.add(suggestion);
          },
          templates: {
            item({ item }) {
              return `
                <div class="autocomplete-item">
                  <div>
                    <svg viewBox="0 0 22 22" width="16" height="16" fill="currentColor">
                      <path d="M0 0h24v24H0z" fill="none"/>
                      <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                    </svg>

                    <span>${item.query}</span>
                  </div>
                </div>
              `;
            },
          },
        },
      ];
    },
    onSubmit: ({ state }) => {
      recentSearches.add({
        objectID: state.query,
        query: state.query,
      });
    },
    onSelect: ({ suggestion }) => {
      recentSearches.add(suggestion);
    },
  };
};
