/** @jsxRuntime classic */
/** @jsx h */
import {
  AutocompleteComponents,
  AutocompletePlugin,
  getAlgoliaResults,
} from '@algolia/autocomplete-js';
import { h } from 'preact';

import { Breadcrumb, GridIcon } from '../components';
import { ALGOLIA_PRODUCTS_INDEX_NAME } from '../constants';
import { searchClient } from '../searchClient';
import { CategoryHit } from '../types';

export const categoriesPlugin: AutocompletePlugin<CategoryHit, {}> = {
  getSources({ query }) {
    if (!query) {
      return [];
    }

    return [
      {
        sourceId: 'categoriesPlugin',
        getItems() {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName: ALGOLIA_PRODUCTS_INDEX_NAME,
                query,
                params: {
                  hitsPerPage: 1,
                },
              },
            ],
          });
        },
        getItemInputValue({ item }) {
          return item.list_categories[item.list_categories.length - 1];
        },
        templates: {
          item({ item, components }) {
            return <CategoryItem hit={item} components={components} />;
          },
        },
      },
    ];
  },
};

type CategoryItemProps = {
  hit: CategoryHit;
  components: AutocompleteComponents;
};

function CategoryItem({ hit, components }: CategoryItemProps) {
  return (
    <div className="aa-ItemWrapper aa-CategoryItem">
      <div className="aa-ItemContent">
        <div className="aa-ItemIcon aa-ItemIcon--noBorder">
          <GridIcon />
        </div>
        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">
            <components.ReverseHighlight
              hit={hit}
              attribute={[
                'list_categories',
                `${hit.list_categories.length - 1}`,
              ]}
            />
          </div>
        </div>
      </div>
      <Breadcrumb
        items={hit.list_categories.slice(0, -1).map((_, index) => (
          <components.Highlight
            key={index}
            hit={hit}
            attribute={['list_categories', `${index}`]}
          />
        ))}
      />
    </div>
  );
}
