/** @jsx h */
import { autocomplete } from '@algolia/autocomplete-js';
import { h, render } from 'preact';

import { brandsPlugin } from './plugins/brandsPlugin';
import { categoriesPlugin } from './plugins/categoriesPlugin';
import { faqPlugin } from './plugins/faqPlugin';
import { productsPlugin } from './plugins/productsPlugin';
import { querySuggestionsPlugin } from './plugins/querySuggestionsPlugin';
import { recentSearchesPlugin } from './plugins/recentSearchesPlugin';

import '@algolia/autocomplete-theme-classic';

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search products, articles, and FAQs',
  debug: true,
  autoFocus: true,
  openOnFocus: true,
  plugins: [
    recentSearchesPlugin,
    querySuggestionsPlugin,
    categoriesPlugin,
    brandsPlugin,
    faqPlugin,
    productsPlugin,
  ],
  render({ elements }, root) {
    const {
      recentSearchesPlugin: recentSearches,
      querySuggestionsPlugin: querySuggestions,
      categoriesPlugin: categories,
      brandsPlugin: brands,
      faqPlugin: faq,
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
            {faq}
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
