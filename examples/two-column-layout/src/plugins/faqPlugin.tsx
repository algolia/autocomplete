/** @jsx h */
import {
  AutocompleteComponents,
  AutocompletePlugin,
  getAlgoliaResults,
} from '@algolia/autocomplete-js';
import { h } from 'preact';

import { Breadcrumb } from '../components/Breadcrumb';
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
          return getAlgoliaResults<FaqHit>({
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

const FaqItem = ({ hit, components }: FaqItemProps) => {
  const breadcrumbItems = hit.list_categories;

  return (
    <div className="aa-ItemWrapper aa-FaqItem">
      <div className="aa-ItemContent">
        <div className="aa-ItemIcon aa-ItemIcon--noBorder">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">
            <components.ReverseHighlight hit={hit} attribute="title" />
          </div>
        </div>
      </div>
      <Breadcrumb items={breadcrumbItems} />
    </div>
  );
};
