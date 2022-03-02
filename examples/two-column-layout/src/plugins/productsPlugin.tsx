/** @jsx h */
import {
  AutocompletePlugin,
  getAlgoliaResults,
} from '@algolia/autocomplete-js';
import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';

import { Blurhash } from '../components/Blurhash';
import {
  StarOutlineIcon,
  StarFillIcon,
  FavoriteFillIcon,
  FavoriteOutlineIcon,
} from '../components/Icons';
import { ALGOLIA_PRODUCTS_INDEX_NAME } from '../constants';
import { searchClient } from '../searchClient';
import { ProductHit } from '../types';

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
          header() {
            return <div className="aa-SourceHeaderTitle">Products</div>;
          },
          item({ item }) {
            return <ProductItem hit={item} />;
          },
        },
      },
    ];
  },
};

const formatPrice = (val: number) => {
  return val.toFixed(2).toLocaleString().replace(/\./g, ',');
};

type ProductItemProps = {
  hit: ProductHit;
};

const ProductItem = ({ hit }: ProductItemProps) => {
  const [loaded, setLoaded] = useState(false);
  const onLoad = useCallback(() => setLoaded(true), []);

  const [favorite, setFavorite] = useState(false);
  const onFavoriteClick = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      setFavorite(!favorite);
    },
    [favorite]
  );
  const FavoriteIcon = favorite ? FavoriteFillIcon : FavoriteOutlineIcon;

  const currentPrice = formatPrice(hit.price.value);
  const discountedPrice = formatPrice(hit.price.discounted_value);
  const priceCurrency = hit.price.currency === 'EUR' ? '€' : '$';

  const rating = hit.reviews.rating;
  const reviews = hit.reviews.count;

  const stars = [];
  for (let i = 0; i < 5; i++) {
    const Star = i >= rating ? StarOutlineIcon : StarFillIcon;
    stars.push(<li key={i}>{<Star className="aa-StarIcon" />}</li>);
  }

  return (
    <a href="#" className="aa-ItemLink aa-ProductItem">
      <div className="aa-ItemContent">
        <div className="aa-ItemPicture">
          <div
            className={[
              'aa-ItemPictureBlurred',
              loaded && 'aa-ItemPictureBlurred--loaded',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <Blurhash
              hash={hit.image_blurred}
              width={32}
              height={32}
              punch={1}
            />
          </div>
          <img src={hit.image_urls[0]} alt={hit.name} onLoad={onLoad} />
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
              <div className="aa-ItemContentPriceCurrent">
                {currentPrice} {priceCurrency}
              </div>
              {hit.price.on_sales && (
                <div className="aa-ItemContentPriceDiscounted">
                  {discountedPrice} {priceCurrency}
                </div>
              )}
            </div>
            <div className="aa-ItemContentRating">
              <ul>{stars}</ul>
              <span className="aa-ItemContentRatingReviews">({reviews})</span>
            </div>
          </div>
        </div>

        <button className="aa-ItemFavorite" onClick={onFavoriteClick}>
          <FavoriteIcon className="aa-FavoriteIcon" />
        </button>
      </div>
    </a>
  );
};
