/** @jsx h */
import { autocomplete } from '@algolia/autocomplete-js';
import { h, render } from 'preact';
import { pipe } from 'ramda';

import { populate, uniqBy } from './functions';
import { articlesPlugin } from './plugins/articlesPlugin';
import { brandsPlugin } from './plugins/brandsPlugin';
import { categoriesPlugin } from './plugins/categoriesPlugin';
import { faqPlugin } from './plugins/faqPlugin';
import { popularPlugin } from './plugins/popularPlugin';
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
    faqPlugin,
    productsPlugin,
    articlesPlugin,
    popularPlugin,
  ],
  reshape({ sourcesBySourceId }) {
    const {
      recentSearchesPlugin: recentSearches,
      querySuggestionsPlugin: querySuggestions,
      categoriesPlugin: categories,
      brandsPlugin: brands,
      faqPlugin: faq,
      ...rest
    } = sourcesBySourceId;

    const removeDuplicates = uniqBy(({ source, item }) => {
      if (
        ['recentSearchesPlugin', 'querySuggestionsPlugin'].indexOf(
          source.sourceId
        ) === -1
      ) {
        return item;
      }

      return source.sourceId === 'querySuggestionsPlugin'
        ? item.query
        : item.label;
    });

    const fillWith = populate({
      mainSourceId: 'querySuggestionsPlugin',
      limit: 8,
    });

    const combine = pipe(removeDuplicates, fillWith);

    return [
      combine(recentSearches, querySuggestions, categories, brands, faq),
      Object.values(rest),
    ];
  },
  render({ elements, state }, root) {
    const {
      recentSearchesPlugin: recentSearches,
      querySuggestionsPlugin: querySuggestions,
      categoriesPlugin: categories,
      brandsPlugin: brands,
      faqPlugin: faq,
      productsPlugin: products,
      articlesPlugin: articles,
      popularPlugin: popular,
    } = elements;

    const hasResults =
      state.collections
        .filter(({ source }) => source.sourceId !== 'popularPlugin')
        .reduce((prev, curr) => prev + curr.items.length, 0) > 0;

    render(
      <div className="aa-PanelLayout aa-Panel--scrollable">
        <div className="aa-PanelSections">
          <div className="aa-PanelSection--left">
            {hasResults && (
              <div>
                {recentSearches}
                {querySuggestions}
                {categories}
                {brands}
                {faq}
              </div>
            )}

            {(!hasResults || !state.query) && (
              <div className="aa-PanelSection--popular">{popular}</div>
            )}
          </div>
          <div className="aa-PanelSection--right">
            {products && (
              <div className="aa-PanelSection--products">
                <div className="aa-PanelSectionSource">{products}</div>
              </div>
            )}
            {articles && (
              <div className="aa-PanelSection--articles">
                <div className="aa-PanelSectionSource">{articles}</div>
              </div>
            )}
          </div>
        </div>
      </div>,
      root
    );
  },
});
