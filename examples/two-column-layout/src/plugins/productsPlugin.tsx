/** @jsx h */
import {
  AutocompletePlugin,
  getAlgoliaResults,
} from '@algolia/autocomplete-js';
import { h } from 'preact';
import { useState } from 'preact/hooks';

import {
  Blurhash,
  StarIcon,
  FavoriteFillIcon,
  FavoriteOutlineIcon,
} from '../components';
import { ALGOLIA_PRODUCTS_INDEX_NAME } from '../constants';
import { searchClient } from '../searchClient';
import { ProductHit } from '../types';
import { cx } from '../utils/cx';

export interface ProductsPluginContext {
  facetName: string;
  facetValue: string;
  query: string;
}

export const productsPlugin: AutocompletePlugin<ProductHit, {}> = {
  getSources({ query }) {
    if (!query) {
      return [];
    }

    return [
      {
        sourceId: 'productsPlugin',
        getItems() {
          return getAlgoliaResults<ProductHit>({
            searchClient,
            queries: [
              {
                indexName: ALGOLIA_PRODUCTS_INDEX_NAME,
                query,
                params: {
                  hitsPerPage: 4,
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
                <span className="aa-SourceHeaderTitle">Products</span>
                <div className="aa-SourceHeaderLine" />
              </Fragment>
            );
          },
          item({ item }) {
            return <ProductItem hit={item} />;
          },
        },
      },
    ];
  },
};

function formatPrice(value: number, currency = 'EUR') {
  return value.toLocaleString('en-US', { style: 'currency', currency });
}

type ProductItemProps = {
  hit: ProductHit;
};

function ProductItem({ hit }: ProductItemProps) {
  const [loaded, setLoaded] = useState(false);

  const [favorite, setFavorite] = useState(false);
  const FavoriteIcon = favorite ? FavoriteFillIcon : FavoriteOutlineIcon;

  const currentPrice = formatPrice(hit.price.value, hit.price.currency);
  const discountedPrice = formatPrice(
    hit.price.discounted_value,
    hit.price.currency
  );

  const stars = Array(5)
    .fill(null)
    .map((_, i) => {
      return (
        <li key={i}>
          <div
            className={cx(
              'aa-ItemIcon aa-ItemIcon--noBorder aa-StarIcon',
              i >= hit.reviews.rating && 'aa-StarIcon--muted'
            )}
          >
            <StarIcon />
          </div>
        </li>
      );
    });

  return (
    <a href="#" className="aa-ItemLink aa-ProductItem">
      <div className="aa-ItemContent">
        <div
          className={cx('aa-ItemPicture', loaded && 'aa-ItemPicture--loaded')}
        >
          <div className="aa-ItemPicture--blurred">
            <Blurhash
              hash={hit.image_blurred}
              width={32}
              height={32}
              punch={1}
            />
          </div>
          <img
            src={hit.image_urls[0]}
            alt={hit.name}
            onLoad={() => setLoaded(true)}
          />
        </div>

        <div className="aa-ItemContentBody">
          <div>
            {hit.brand && (
              <div className="aa-ItemContentBrand">{hit.brand}</div>
            )}
            <div className="aa-ItemContentTitle">{hit.name}</div>
          </div>
          <div>
            <div className="aa-ItemContentPrice">
              <div className="aa-ItemContentPriceCurrent">{currentPrice}</div>
              {hit.price.on_sales && (
                <div className="aa-ItemContentPriceDiscounted">
                  {discountedPrice}
                </div>
              )}
            </div>
            <div className="aa-ItemContentRating">
              <ul>{stars}</ul>
              <span className="aa-ItemContentRatingReviews">
                ({hit.reviews.count})
              </span>
            </div>
          </div>
        </div>

        <button
          className="aa-ItemFavorite"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setFavorite(!favorite);
          }}
        >
          <div className="aa-ItemIcon aa-ItemIcon--noBorder aa-FavoriteIcon">
            <FavoriteIcon />
          </div>
        </button>
      </div>
    </a>
  );
}
