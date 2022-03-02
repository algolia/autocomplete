/** @jsx h */
import { autocomplete } from '@algolia/autocomplete-js';
import { h, render } from 'preact';

import { recentSearchesPlugin } from './plugins/recentSearchesPlugin';
import { querySuggestionsPlugin } from './plugins/querySuggestionsPlugin';

import '@algolia/autocomplete-theme-classic';

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search products, articles, FAQ',
  debug: true,
  autoFocus: true,
  openOnFocus: true,
  plugins: [recentSearchesPlugin, querySuggestionsPlugin],
  render({ elements }, root) {
    const {
      recentSearchesPlugin: recentSearches,
      querySuggestionsPlugin: querySuggestions,
    } = elements;

    render(
      <div className="aa-PanelLayout aa-Panel--scrollable">
        <div className="aa-PanelSections">
          <div className="aa-PanelSection--left">
            {recentSearches}
            {querySuggestions}
          </div>
          <div className="aa-PanelSection--right"></div>
        </div>
      </div>,
      root
    );
  },
});
