import {
  AutocompletePlugin,
  AutocompleteState,
} from '@algolia/autocomplete-core';
import {
  getAlgoliaHits as defaultGetAlgoliaHits,
  SourceTemplates,
} from '@algolia/autocomplete-js';
import { SearchOptions } from '@algolia/client-search';
import { SearchClient } from 'algoliasearch/lite';

import {
  getTemplates as defaultGetTemplates,
  GetTemplatesParams,
} from './getTemplates';
import { QuerySuggestionsHit } from './types';

export type CreateQuerySuggestionsPluginParams<
  TItem extends QuerySuggestionsHit
> = {
  searchClient: SearchClient;
  indexName: string;
  getSearchParams?(params: { state: AutocompleteState<TItem> }): SearchOptions;
  getTemplates?(params: GetTemplatesParams<TItem>): SourceTemplates<TItem>;
  getAlgoliaHits?: typeof defaultGetAlgoliaHits;
};

export function createQuerySuggestionsPlugin<
  TItem extends QuerySuggestionsHit
>({
  searchClient,
  indexName,
  getSearchParams = () => ({}),
  getTemplates = defaultGetTemplates,
  getAlgoliaHits = defaultGetAlgoliaHits,
}: CreateQuerySuggestionsPluginParams<TItem>): AutocompletePlugin<
  TItem,
  undefined
> {
  return {
    getSources({ query, setQuery, refresh, state }) {
      return [
        {
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
          templates: getTemplates({
            onTapAhead(item) {
              setQuery(item.query);
              refresh();
            },
          }),
        },
      ];
    },
  };
}
