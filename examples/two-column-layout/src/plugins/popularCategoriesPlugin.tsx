/** @jsx h */
import {
  AutocompleteComponents,
  AutocompletePlugin,
  getAlgoliaFacets,
} from '@algolia/autocomplete-js';
import { h } from 'preact';

import { ALGOLIA_PRODUCTS_INDEX_NAME } from '../constants';
import { searchClient } from '../searchClient';
import { PopularCategoryHit } from '../types';

const baseUrl = 'https://res.cloudinary.com/hilnmyskv/image/upload/v1646067858';
const images = {
  Women: `${baseUrl}/women_category_vwzkln.jpg`,
  Bags: `${baseUrl}/bags_category_qd7ssj.jpg`,
  Clothing: `${baseUrl}/clothing_category_xhiz1s.jpg`,
  Men: `${baseUrl}/men_category_wfcley.jpg`,
  'T-shirts': `${baseUrl}/t-shirts_category_gzqcvd.jpg`,
  Shoes: `${baseUrl}/shoes_category_u4fi0q.jpg`,
};

export const popularCategoriesPlugin: AutocompletePlugin<
  PopularCategoryHit,
  {}
> = {
  getSources() {
    return [
      {
        sourceId: 'popularCategoriesPlugin',
        getItems() {
          return getAlgoliaFacets({
            searchClient,
            queries: [
              {
                indexName: ALGOLIA_PRODUCTS_INDEX_NAME,
                facet: 'list_categories',
                params: {
                  facetQuery: '',
                  maxFacetHits: 6,
                },
              },
            ],
          });
        },
        getItemInputValue({ item }) {
          return item.label;
        },
        onSelect({ setIsOpen }) {
          setIsOpen(true);
        },
        templates: {
          header({ Fragment }) {
            return (
              <Fragment>
                <span className="aa-SourceHeaderTitle">Popular categories</span>
                <div className="aa-SourceHeaderLine" />
              </Fragment>
            );
          },
          item({ item, components }) {
            return <CategoryItem hit={item} components={components} />;
          },
        },
      },
    ];
  },
};

type CategoryItemProps = {
  hit: PopularCategoryHit;
  components: AutocompleteComponents;
};

const CategoryItem = ({ hit }: CategoryItemProps) => {
  return (
    <div className="aa-ItemWrapper aa-PopularCategoryItem">
      <div className="aa-ItemContent">
        <div className="aa-ItemPicture">
          <img src={images[hit.label]} alt={hit.label} />
        </div>
        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">
            {hit.label} <span>({hit.count})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
