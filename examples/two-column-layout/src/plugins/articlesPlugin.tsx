/** @jsx h */
import {
  AutocompletePlugin,
  getAlgoliaResults,
} from '@algolia/autocomplete-js';
import { h } from 'preact';

import { ALGOLIA_ARTICLES_INDEX_NAME } from '../constants';
import { searchClient } from '../searchClient';
import { ArticleHit } from '../types';

export const articlesPlugin: AutocompletePlugin<ArticleHit, {}> = {
  getSources({ query }) {
    if (!query) {
      return [];
    }

    return [
      {
        sourceId: 'articlesPlugin',
        getItems() {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName: ALGOLIA_ARTICLES_INDEX_NAME,
                query,
                params: {
                  hitsPerPage: 2,
                },
              },
            ],
          });
        },
        onSelect({ setIsOpen }) {
          setIsOpen(true);
        },
        templates: {
          header({ Fragment }) {
            return (
              <Fragment>
                <span className="aa-SourceHeaderTitle">Articles</span>
                <div className="aa-SourceHeaderLine" />
              </Fragment>
            );
          },
          item({ item }) {
            return <ArticleItem hit={item} />;
          },
        },
      },
    ];
  },
};

type ArticleItemProps = {
  hit: ArticleHit;
};

const ArticleItem = ({ hit }: ArticleItemProps) => {
  const articleDate = new Date(hit.date);
  const articleMonth = articleDate.toLocaleDateString('en-US', {
    month: 'long',
  });
  const articleYear = articleDate.getFullYear();

  return (
    <a href="#" className="aa-ItemLink aa-ArticleItem">
      <div className="aa-ItemContent">
        <div className="aa-ItemPicture">
          <img src={hit.image_url} alt={hit.title} />
        </div>

        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">{hit.title}</div>
          <div className="aa-ItemContentDate">
            Published on {articleMonth} {articleYear}
          </div>
        </div>
      </div>
    </a>
  );
};
