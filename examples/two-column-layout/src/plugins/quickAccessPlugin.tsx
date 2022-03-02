/** @jsx h */
import {
  AutocompletePlugin,
  getAlgoliaResults,
} from '@algolia/autocomplete-js';
import { SearchResponse } from '@algolia/client-search';
import { h } from 'preact';

import { ALGOLIA_PRODUCTS_INDEX_NAME } from '../constants';
import { searchClient } from '../searchClient';
import { QuickAccessHit } from '../types';

export const quickAccessPlugin: AutocompletePlugin<QuickAccessHit, {}> = {
  getSources({ query }) {
    if (query) {
      return [];
    }

    return [
      {
        sourceId: 'quickAccessPlugin',
        getItems() {
          return getAlgoliaResults<QuickAccessHit>({
            searchClient,
            queries: [
              {
                indexName: ALGOLIA_PRODUCTS_INDEX_NAME,
                query,
                params: {
                  hitsPerPage: 0,
                  ruleContexts: ['quickAccess'],
                },
              },
            ],
            transformResponse({ results }) {
              const resultsAs = results as SearchResponse[];
              const userData = resultsAs?.[0].userData;
              const items = userData?.[0]?.items;
              return items || [];
            },
          });
        },
        templates: {
          header() {
            return <div className="aa-SourceHeaderTitle">Quick access</div>;
          },
          item({ item }) {
            return <QuickAccessItem hit={item} />;
          },
        },
      },
    ];
  },
};

type QuickAccessItemProps = {
  hit: QuickAccessHit;
};

const QuickAccessItem = ({ hit }: QuickAccessItemProps) => {
  return (
    <a
      href={hit.href}
      className={[
        'aa-ItemLink aa-QuickAccessItem',
        `aa-QuickAccessItem--${hit.template}`,
      ].join(' ')}
    >
      <div className="aa-ItemContent">
        {hit.image && (
          <div className="aa-ItemPicture">
            <img src={hit.image} alt={hit.title} />
          </div>
        )}

        <div className="aa-ItemContentBody">
          {hit.date && <div className="aa-ItemContentDate">{hit.date}</div>}
          <div
            className="aa-ItemContentTitle"
            dangerouslySetInnerHTML={{ __html: hit.title }}
          />
          {hit.subtitle && (
            <div
              className="aa-ItemContentSubTitle"
              dangerouslySetInnerHTML={{ __html: hit.subtitle }}
            />
          )}

          {hit.links && (
            <ul>
              {hit.links.map((link, i) => (
                <li key={i}>
                  <a href={link.href}>{link.text}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </a>
  );
};
