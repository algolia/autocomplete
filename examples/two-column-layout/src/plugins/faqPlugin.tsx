/** @jsxRuntime classic */
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
        getItemInputValue({ item }) {
          return item.title;
        },
        templates: {
          item({ item, components }) {
            return <FaqItem hit={item} components={components} />;
          },
        },
      },
    ];
  },
};

type FaqItemProps = {
  hit: FaqHit;
  components: AutocompleteComponents;
};

function FaqItem({ hit, components }: FaqItemProps) {
  return (
    <div className="aa-ItemWrapper aa-FaqItem">
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
