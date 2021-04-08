import {
  AutocompletePlugin,
  AutocompleteState,
} from '@algolia/autocomplete-core';
import { AutocompleteSource, getAlgoliaHits } from '@algolia/autocomplete-js';
import { getAttributeValueByPath } from '@algolia/autocomplete-shared';
import { SearchOptions } from '@algolia/client-search';
import { SearchClient } from 'algoliasearch/lite';

import { getTemplates } from './getTemplates';
import { AutocompleteQuerySuggestionsHit, QuerySuggestionsHit } from './types';

export type CreateQuerySuggestionsPluginParams<
  TItem extends QuerySuggestionsHit
> = {
  /**
   * The initialized Algolia search client.
   *
   * @link https://autocomplete.algolia.com/docs/createQuerySuggestionsPlugin#searchclient
   */
  searchClient: SearchClient;
  /**
   * The index name.
   *
   * @link https://autocomplete.algolia.com/docs/createQuerySuggestionsPlugin#indexname
   */
  indexName: string;
  /**
   * A function returning [Algolia search parameters](https://www.algolia.com/doc/api-reference/search-api-parameters/).
   *
   * @link https://autocomplete.algolia.com/docs/createQuerySuggestionsPlugin#getsearchparams
   */
  getSearchParams?(params: { state: AutocompleteState<TItem> }): SearchOptions;
  /**
   * A function to transform the provided source.
   *
   * @link https://autocomplete.algolia.com/docs/createQuerySuggestionsPlugin#transformsource
   */
  transformSource?(params: {
    source: AutocompleteSource<TItem>;
    state: AutocompleteState<TItem>;
    onTapAhead(item: TItem): void;
  }): AutocompleteSource<TItem>;
  /**
   * The attribute or attribute path to display categories for.
   *
   * @example ["instant_search", "facets", "exact_matches", "categories"]
   * @example ["instant_search", "facets", "exact_matches", "hierarchicalCategories.lvl0"]
   * @link https://autocomplete.algolia.com/docs/createQuerySuggestionsPlugin#categoryattribute
   */
  categoryAttribute?: string | string[];
  /**
   * How many items to display categories for.
   *
   * @default 1
   * @link https://autocomplete.algolia.com/docs/createQuerySuggestionsPlugin#itemswithcategories
   */
  itemsWithCategories?: number;
  /**
   * The number of categories to display per item.
   *
   * @default 1
   * @link https://autocomplete.algolia.com/docs/createQuerySuggestionsPlugin#categoriesperitem
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
  itemsWithCategories = 1,
  categoriesPerItem = 1,
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

                  if (i <= itemsWithCategories - 1) {
                    const categories = getAttributeValueByPath(
                      current,
                      Array.isArray(categoryAttribute)
                        ? categoryAttribute
                        : [categoryAttribute]
                    )
                      .map((x) => x.value)
                      .slice(0, categoriesPerItem);

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
          state,
        }),
      ];
    },
  };
}
