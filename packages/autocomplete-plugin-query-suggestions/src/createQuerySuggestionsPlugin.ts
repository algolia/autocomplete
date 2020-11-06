import { AutocompletePlugin } from '@algolia/autocomplete-core';
import { getAlgoliaHits, SourceTemplates } from '@algolia/autocomplete-js';
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
  getSearchParams?(): SearchOptions;
  getTemplates?(
    params: GetTemplatesParams<TItem>
  ): SourceTemplates<TItem>['templates'];
};

export function createQuerySuggestionsPlugin<
  TItem extends QuerySuggestionsHit
>({
  searchClient,
  indexName,
  getSearchParams = () => ({}),
  getTemplates = defaultGetTemplates,
}: CreateQuerySuggestionsPluginParams<TItem>): AutocompletePlugin<
  TItem,
  undefined
> {
  return {
    getSources({ query, setQuery, refresh }) {
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
                  params: getSearchParams(),
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
