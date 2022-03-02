/** @jsx h */
import { autocomplete } from '@algolia/autocomplete-js';
import { h, render } from 'preact';

import { productsPlugin } from './plugins/productsPlugin';
import { querySuggestionsPlugin } from './plugins/querySuggestionsPlugin';
import { recentSearchesPlugin } from './plugins/recentSearchesPlugin';

import '@algolia/autocomplete-theme-classic';

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search products, articles, and FAQs',
  autoFocus: true,
  openOnFocus: true,
  plugins: [recentSearchesPlugin, querySuggestionsPlugin, productsPlugin],
  render({ elements }, root) {
    const {
      recentSearchesPlugin: recentSearches,
      querySuggestionsPlugin: querySuggestions,
      productsPlugin: products,
    } = elements;

    const productsSection = products && (
      <div className="aa-PanelSection--products">
        <div className="aa-PanelSectionSource">{products}</div>
      </div>
    );

    render(
      <div className="aa-PanelLayout aa-Panel--scrollable">
        <div className="aa-PanelSections">
          <div className="aa-PanelSection--left">
            {recentSearches}
            {querySuggestions}
          </div>
          <div className="aa-PanelSection--right">{productsSection}</div>
        </div>
      </div>,
      root
    );
  },
});
