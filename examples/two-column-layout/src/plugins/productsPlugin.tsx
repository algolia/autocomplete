/** @jsxRuntime classic */
/** @jsx h */
import {
  AutocompleteComponents,
  AutocompletePlugin,
  getAlgoliaResults,
} from '@algolia/autocomplete-js';
import { SearchResponse } from '@algolia/client-search';
import { h } from 'preact';
import { useState } from 'preact/hooks';

import { Blurhash, StarIcon, FavoriteIcon } from '../components';
import { ALGOLIA_PRODUCTS_INDEX_NAME } from '../constants';
import { searchClient } from '../searchClient';
import { ProductHit } from '../types';
import { cx } from '../utils';

export const productsPlugin: AutocompletePlugin<ProductHit, {}> = {
  getSources({ query }) {
    if (!query) {
      return [];
    }

    return [
      {
        sourceId: 'productsPlugin',
        getItems({ setContext }) {
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
            transformResponse({ hits, results }) {
              setContext({
                nbProducts: (results[0] as SearchResponse<ProductHit>).nbHits,
              });

              return hits;
            },
          });
        },
        onSelect({ setIsOpen }) {
          setIsOpen(true);
        },
        templates: {
          header({ state, Fragment }) {
            return (
              <Fragment>
                <div className="aa-SourceHeaderTitle">
                  Products for {state.query}
                </div>
                <div className="aa-SourceHeaderLine" />
              </Fragment>
            );
          },
          item({ item, components }) {
            return <ProductItem hit={item} components={components} />;
          },
          footer({ state }) {
            return (
              state.context.nbProducts > 4 && (
                <div style={{ textAlign: 'center' }}>
                  <a
                    href="https://example.org/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="aa-SeeAllBtn"
                  >
                    See All Products ({state.context.nbProducts})
                  </a>
                </div>
              )
            );
          },
        },
      },
    ];
  },
};

function formatPrice(value: number, currency: string) {
  return value.toLocaleString('en-US', { style: 'currency', currency });
}

type ProductItemProps = {
  hit: ProductHit;
  components: AutocompleteComponents;
};

function ProductItem({ hit, components }: ProductItemProps) {
  const [loaded, setLoaded] = useState(false);
  const [favorite, setFavorite] = useState(false);

  return (
    <a
      href="https://example.org/"
      target="_blank"
      rel="noreferrer noopener"
      className="aa-ItemLink aa-ProductItem"
    >
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
              <div className="aa-ItemContentBrand">
                <components.Highlight hit={hit} attribute="brand" />
              </div>
            )}
            <div className="aa-ItemContentTitleWrapper">
              <div className="aa-ItemContentTitle">
                <components.Highlight hit={hit} attribute="name" />
              </div>
            </div>
          </div>
          <div>
            <div className="aa-ItemContentPrice">
              <div className="aa-ItemContentPriceCurrent">
                {formatPrice(hit.price.value, hit.price.currency)}
              </div>
              {hit.price.on_sales && (
                <div className="aa-ItemContentPriceDiscounted">
                  {formatPrice(hit.price.discounted_value, hit.price.currency)}
                </div>
              )}
            </div>
            <div className="aa-ItemContentRating">
              <ul>
                {Array(5)
                  .fill(null)
                  .map((_, index) => (
                    <li key={index}>
                      <div
                        className={cx(
                          'aa-ItemIcon aa-ItemIcon--noBorder aa-StarIcon',
                          index >= hit.reviews.rating && 'aa-StarIcon--muted'
                        )}
                      >
                        <StarIcon />
                      </div>
                    </li>
                  ))}
              </ul>
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
            setFavorite((currentFavorite) => !currentFavorite);
          }}
        >
          <div className="aa-ItemIcon aa-ItemIcon--noBorder aa-FavoriteIcon">
            <FavoriteIcon
              className={cx(!favorite && 'aa-FavoriteIcon--outlined')}
            />
          </div>
        </button>
      </div>
    </a>
  );
}
