import {
  AutocompletePlugin,
  AutocompleteState,
} from '@algolia/autocomplete-core';
import { AutocompleteSource, getAlgoliaHits } from '@algolia/autocomplete-js';
import { SearchOptions } from '@algolia/client-search';
import { SearchClient } from 'algoliasearch/lite';

import { getTemplates } from './getTemplates';
import { AutocompleteQuerySuggestionsHit, QuerySuggestionsHit } from './types';

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
  /**
   * The attribute to display categories.
   */
  categoryAttribute?: string;
  /**
   * The number of items to display categories for.
   * @default 1
   */
  categoriesLimit?: number;
  /**
   * The number of categories to display per item.
   * @default 1
   */
  categoriesPerItem?: number;
};

export function createQuerySuggestionsPlugin<
  TItem extends AutocompleteQuerySuggestionsHit
>({
  searchClient,
  indexName,
  getSearchParams = () => ({}),
  transformSource = ({ source }) => source,
  categoryAttribute,
  categoriesPerItem = 1,
  categoriesLimit = 1,
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

      return [
        transformSource({
          source: {
            sourceId: 'querySuggestionsPlugin',
            getItemInputValue({ item }) {
              return item.query;
            },
            getItems() {
              return getAlgoliaHits<QuerySuggestionsHit<typeof indexName>>({
                searchClient,
                queries: [
                  {
                    indexName,
                    query,
                    params: getSearchParams({ state }),
                  },
                ],
              }).then(([hits]) => {
                if (!query || !categoryAttribute) {
                  return hits as any;
                }

                return hits.reduce<
                  Array<AutocompleteQuerySuggestionsHit<typeof indexName>>
                >((acc, current, i) => {
                  const items: Array<
                    AutocompleteQuerySuggestionsHit<typeof indexName>
                  > = [current];

                  if (i <= categoriesPerItem - 1) {
                    const categories = current.instant_search.facets.exact_matches[
                      categoryAttribute
                    ]
                      .map((x) => x.value)
                      .slice(0, categoriesLimit);

                    for (const category of categories) {
                      items.push({
                        __autocomplete_qsCategory: category,
                        ...current,
                      } as any);
                    }
                  }

                  acc.push(...items);

                  return acc;
                }, []);
              });
            },
            templates: getTemplates({ onTapAhead }),
          },
          onTapAhead,
        }),
      ];
    },
  };
}
