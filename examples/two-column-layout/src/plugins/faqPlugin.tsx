/** @jsx h */
import {
  AutocompleteComponents,
  AutocompletePlugin,
  getAlgoliaResults,
} from '@algolia/autocomplete-js';
import { h } from 'preact';

import { Breadcrumb, InfoIcon } from '../components';
import { ALGOLIA_FAQ_INDEX_NAME } from '../constants';
import { searchClient } from '../searchClient';
import { setSmartPreview } from '../setSmartPreview';
import { FaqHit } from '../types';

export const faqPlugin: AutocompletePlugin<FaqHit, {}> = {
  getSources({ query }) {
    if (!query) {
      return [];
    }

    return [
      {
        sourceId: 'faqPlugin',
        getItems() {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName: ALGOLIA_FAQ_INDEX_NAME,
                query,
                params: {
                  hitsPerPage: 1,
                },
              },
            ],
          });
        },
        onActive(params) {
          setSmartPreview({
            preview: params.item,
            ...params,
          });
        },
        templates: {
          item({ item, components, state }) {
            return (
              <FaqItem
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

type FaqItemProps = {
  hit: FaqHit;
  components: AutocompleteComponents;
  active: boolean;
};

function FaqItem({ hit, components, active }: FaqItemProps) {
  return (
    <div className="aa-ItemWrapper aa-FaqItem" data-active={active}>
      <div className="aa-ItemContent">
        <div className="aa-ItemIcon aa-ItemIcon--noBorder">
          <InfoIcon />
        </div>
        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">
            <components.ReverseHighlight hit={hit} attribute="title" />
          </div>
        </div>
      </div>
      <Breadcrumb
        items={hit.list_categories.map((_, index) => (
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
