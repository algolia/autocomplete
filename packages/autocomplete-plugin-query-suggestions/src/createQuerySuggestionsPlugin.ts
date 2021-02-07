import {
  AutocompletePlugin,
  AutocompleteState,
} from '@algolia/autocomplete-core';
import { AutocompleteSource, getAlgoliaHits } from '@algolia/autocomplete-js';
import { SearchOptions } from '@algolia/client-search';
import { SearchClient } from 'algoliasearch/lite';

import { getTemplates } from './getTemplates';
import { QuerySuggestionsHit } from './types';

export type CreateQuerySuggestionsPluginParams<
  TItem extends QuerySuggestionsHit
> = {
  searchClient: SearchClient;
  indexName: string;
  getSearchParams?(params: { state: AutocompleteState<TItem> }): SearchOptions;
  transformSource?(params: {
    source: AutocompleteSource<TItem>;
    onTapAhead(item: TItem): void;
  }): AutocompleteSource<TItem>;
};

export function createQuerySuggestionsPlugin<
  TItem extends QuerySuggestionsHit
>({
  searchClient,
  indexName,
  getSearchParams = () => ({}),
  transformSource = ({ source }) => source,
}: CreateQuerySuggestionsPluginParams<TItem>): AutocompletePlugin<
  TItem,
  undefined
> {
  return {
    getSources({ query, setQuery, refresh, state }) {
      function onTapAhead(item: TItem) {
        setQuery(item.query);
        refresh();
      }

      const templates = getTemplates({ onTapAhead });

      return [
        transformSource({
          source: {
            sourceId: 'querySuggestionsPlugin',
            getItemInputValue({ item }) {
              return item.query;
            },
            getItems() {
              return getAlgoliaHits<TItem>({
                searchClient,
                queries: [
                  {
                    indexName,
                    query,
                    params: getSearchParams({ state }),
                  },
                ],
              });
            },
            templates,
          },
          onTapAhead,
        }),
      ];
    },
  };
}
