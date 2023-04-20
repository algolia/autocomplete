import { useEffect, useRef, createElement, Fragment } from 'react';
import { createRoot } from 'react-dom/client';
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import algoliasearch from 'algoliasearch/lite';

import type { AutocompleteComponents } from '@algolia/autocomplete-js';
import type { Hit } from '@algolia/client-search';
import type { Root } from 'react-dom/client';

import '@algolia/autocomplete-theme-classic';

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const searchClient = algoliasearch(appId, apiKey);

type ProductHit = Hit<{
  brand: string;
  categories: string[];
  description: string;
  image: string;
  name: string;
  price: number;
  rating: number;
  type: string;
  url: string;
}>;

export default function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panelRootRef = useRef<Root | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const search = autocomplete<ProductHit>({
      container: containerRef.current,
      placeholder: 'Search',
      insights: true,
      getSources({ query }) {
        return [
          {
            sourceId: 'products',
            getItems() {
              return getAlgoliaResults<ProductHit>({
                searchClient,
                queries: [
                  {
                    indexName: 'instant_search',
                    query,
                  },
                ],
              });
            },
            templates: {
              item({ item, components }) {
                return <ProductItem hit={item} components={components} />;
              },
              noResults() {
                return 'No products matching.';
              },
            },
          },
        ];
      },
      renderer: { createElement, Fragment, render: () => {} },
      render({ children }, root) {
        if (!panelRootRef.current || rootRef.current !== root) {
          rootRef.current = root;

          panelRootRef.current?.unmount();
          panelRootRef.current = createRoot(root);
        }

        panelRootRef.current.render(children);
      },
    });

    return () => {
      search.destroy();
    };
  }, []);

  return <div ref={containerRef} />;
}

type ProductItemProps = {
  hit: ProductHit;
  components: AutocompleteComponents;
};

function ProductItem({ hit, components }: ProductItemProps) {
  return (
    <div className="aa-ItemWrapper">
      <div className="aa-ItemContent">
        <div className="aa-ItemIcon aa-ItemIcon--picture aa-ItemIcon--alignTop">
          <img src={hit.image} alt={hit.name} width="40" height="40" />
        </div>

        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">
            <components.Highlight hit={hit} attribute="name" />
          </div>
          <div className="aa-ItemContentDescription">
            By <strong>{hit.brand}</strong> in{' '}
            <strong>{hit.categories[0]}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
