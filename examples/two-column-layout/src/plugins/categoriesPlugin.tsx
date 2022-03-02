/** @jsx h */
import {
  AutocompletePlugin,
  getAlgoliaResults,
} from '@algolia/autocomplete-js';
import { h } from 'preact';

import { Breadcrumb } from '../components/Breadcrumb';
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
          return getAlgoliaResults<CategoryHit>({
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
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        </div>
        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">{category}</div>
        </div>
      </div>
      <Breadcrumb items={breadcrumbCategories} />
    </div>
  );
};
