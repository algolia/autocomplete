/** @jsx h */
import { autocomplete } from '@algolia/autocomplete-js';
import { h, render } from 'preact';

import { brandsPlugin } from './plugins/brandsPlugin';
import { categoriesPlugin } from './plugins/categoriesPlugin';
import { productsPlugin } from './plugins/productsPlugin';
import { querySuggestionsPlugin } from './plugins/querySuggestionsPlugin';
import { recentSearchesPlugin } from './plugins/recentSearchesPlugin';

import '@algolia/autocomplete-theme-classic';

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search products, articles, and FAQs',
  autoFocus: true,
  openOnFocus: true,
  plugins: [
    recentSearchesPlugin,
    querySuggestionsPlugin,
    categoriesPlugin,
    brandsPlugin,
    productsPlugin,
  ],
  render({ elements }, root) {
    const {
      recentSearchesPlugin: recentSearches,
      querySuggestionsPlugin: querySuggestions,
      categoriesPlugin: categories,
      brandsPlugin: brands,
      productsPlugin: products,
    } = elements;

    render(
      <div className="aa-PanelLayout aa-Panel--scrollable">
        <div className="aa-PanelSections">
          <div className="aa-PanelSection--left">
            {recentSearches}
            {querySuggestions}
            {categories}
            {brands}
          </div>
          <div className="aa-PanelSection--right">
            {products && (
              <div className="aa-PanelSection--products">
                <div className="aa-PanelSectionSource">{products}</div>
              </div>
            )}
          </div>
        </div>
      </div>,
      root
    );
  },
});
