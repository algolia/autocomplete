/** @jsx h */
import {
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
          item({ item }) {
            return <CategoryItem hit={item} />;
          },
        },
      },
    ];
  },
};

type CategoryItemProps = {
  hit: CategoryHit;
};

const CategoryItem = ({ hit }: CategoryItemProps) => {
  const breadcrumbCategories = hit.list_categories.slice(0, -1);
  const category = hit.list_categories[hit.list_categories.length - 1];

  return (
    <div className="aa-ItemWrapper aa-CategoryItem">
      <div className="aa-ItemContent">
        <div className="aa-ItemIcon aa-ItemIcon--noBorder">
          <GridIcon />
        </div>
        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">{category}</div>
        </div>
      </div>
      <Breadcrumb items={breadcrumbCategories} />
    </div>
  );
};
