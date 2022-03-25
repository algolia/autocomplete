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
import { setSmartPreview } from '../setSmartPreview';
import { CategoryHit } from '../types';
import { cx } from '../utils';

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
        onActive(params) {
          setSmartPreview({
            preview: {
              facetName: 'list_categories',
              facetValue: params.itemInputValue,
            },
            ...params,
          });
        },
        templates: {
          item({ item, components, state }) {
            return (
              <CategoryItem
                hit={item}
                components={components}
                active={
                  state.context.lastActiveItemId === item.__autocomplete_id
                }
              />
            );
          },
        },
      },
    ];
  },
};

type CategoryItemProps = {
  hit: CategoryHit;
  components: AutocompleteComponents;
  active: boolean;
};

function CategoryItem({ hit, components, active }: CategoryItemProps) {
  return (
    <div className={cx('aa-ItemWrapper aa-CategoryItem')} data-active={active}>
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
          <components.ReverseHighlight
            key={index}
            hit={hit}
            attribute={['list_categories', `${index}`]}
          />
        ))}
      />
    </div>
  );
}
