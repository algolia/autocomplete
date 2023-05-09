/** @jsxRuntime classic */
/** @jsx h */
import {
  autocomplete,
  AutocompleteComponents,
  AutocompleteOptions,
  getAlgoliaResults,
  GetSources,
} from '@algolia/autocomplete-js';
import { Hit } from '@algolia/client-search';
import algoliasearch from 'algoliasearch/lite';
import { h } from 'preact';

import '@algolia/autocomplete-theme-classic';

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const searchClient = algoliasearch(appId, apiKey);

type AutocompleteItem = Hit<{
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

const getSources: GetSources<AutocompleteItem> = ({ query }) => {
  return [
    {
      sourceId: 'products',
      getItems() {
        return getAlgoliaResults<AutocompleteItem>({
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
          return <ProductItem item={item} components={components} />;
        },
        noResults() {
          return 'No products matching.';
        },
      },
    },
  ];
};

const search = autocomplete<AutocompleteItem>({
  container: '#autocomplete',
  placeholder: 'Search',
  getSources,
  insights: true,
});

const searchLeft = autocomplete<AutocompleteItem>({
  container: '#autocomplete-left',
  placeholder: 'Search',
  getSources,
  insights: true,
});

const searchRight = autocomplete<AutocompleteItem>({
  container: '#autocomplete-right',
  placeholder: 'Search',
  getSources,
  insights: true,
});

type ProductItemProps = {
  item: AutocompleteItem;
  components: AutocompleteComponents;
};

const ProductItem = ({ item, components }: ProductItemProps) => (
  <a href={item.url} className="aa-ItemLink">
    <div className="aa-ItemContent">
      <div className="aa-ItemIcon aa-ItemIcon--picture aa-ItemIcon--alignTop">
        <img src={item.image} alt={item.name} width="40" height="40" />
      </div>

      <div className="aa-ItemContentBody">
        <div className="aa-ItemContentTitle">
          <components.ReverseHighlight hit={item} attribute="name" />
        </div>
        <div className="aa-ItemContentDescription">
          By <strong>{item.brand}</strong> in{' '}
          <strong>{item.categories[0]}</strong>
        </div>
      </div>
    </div>
  </a>
);

document
  .querySelectorAll<HTMLInputElement>('input[name="placement"]')
  .forEach((radio) => {
    radio.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement;
      const panelPlacement = target.value as Required<
        AutocompleteOptions<AutocompleteItem>['panelPlacement']
      >;

      search.update({ panelPlacement });
      searchLeft.update({ panelPlacement });
      searchRight.update({ panelPlacement });
    });
  });
