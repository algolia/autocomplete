/** @jsx h */
import {
  AutocompleteComponents,
  AutocompletePlugin,
  getAlgoliaFacets,
} from '@algolia/autocomplete-js';
import { h } from 'preact';

import { TagIcon } from '../components';
import { ALGOLIA_PRODUCTS_INDEX_NAME } from '../constants';
import { searchClient } from '../searchClient';
import { setSmartPreview } from '../setSmartPreview';
import { BrandHit } from '../types';

export const brandsPlugin: AutocompletePlugin<BrandHit, {}> = {
  getSources({ query }) {
    if (!query) {
      return [];
    }

    return [
      {
        sourceId: 'brandsPlugin',
        getItems() {
          return getAlgoliaFacets({
            searchClient,
            queries: [
              {
                indexName: ALGOLIA_PRODUCTS_INDEX_NAME,
                facet: 'brand',
                params: {
                  facetQuery: query,
                  maxFacetHits: 2,
                },
              },
            ],
          });
        },
        getItemInputValue({ item }) {
          return item.label;
        },
        onActive(params) {
          setSmartPreview({
            preview: {
              facetName: 'brand',
              facetValue: params.item.label,
            },
            ...params,
          });
        },
        templates: {
          item({ item, components, state }) {
            return (
              <BrandItem
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

type BrandItemProps = {
  hit: BrandHit;
  components: AutocompleteComponents;
  active: boolean;
};

function BrandItem({ hit, components, active }: BrandItemProps) {
  return (
    <div className="aa-ItemWrapper" data-active={active}>
      <div className="aa-ItemContent">
        <div className="aa-ItemIcon aa-ItemIcon--noBorder">
          <TagIcon />
        </div>
        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">
            <components.ReverseHighlight hit={hit} attribute="label" />
          </div>
        </div>
      </div>
    </div>
  );
}
