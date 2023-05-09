/** @jsxRuntime classic */
/** @jsx h */
import { autocomplete } from '@algolia/autocomplete-js';
import { h, render } from 'preact';
import { pipe } from 'ramda';

import { createFillWith, uniqBy } from './functions';
import { articlesPlugin } from './plugins/articlesPlugin';
import { brandsPlugin } from './plugins/brandsPlugin';
import { categoriesPlugin } from './plugins/categoriesPlugin';
import { faqPlugin } from './plugins/faqPlugin';
import { popularCategoriesPlugin } from './plugins/popularCategoriesPlugin';
import { popularPlugin } from './plugins/popularPlugin';
import { productsPlugin } from './plugins/productsPlugin';
import { querySuggestionsPlugin } from './plugins/querySuggestionsPlugin';
import { quickAccessPlugin } from './plugins/quickAccessPlugin';
import { recentSearchesPlugin } from './plugins/recentSearchesPlugin';
import { cx, hasSourceActiveItem, isDetached } from './utils';

import '@algolia/autocomplete-theme-classic';

const removeDuplicates = uniqBy(({ source, item }) => {
  const sourceIds = ['recentSearchesPlugin', 'querySuggestionsPlugin'];
  if (sourceIds.indexOf(source.sourceId) === -1) {
    return item;
  }

  return source.sourceId === 'querySuggestionsPlugin' ? item.query : item.label;
});

const fillWith = createFillWith({
  mainSourceId: 'querySuggestionsPlugin',
  limit: isDetached() ? 6 : 10,
});

const combine = pipe(removeDuplicates, fillWith);

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search products, articles, and FAQs',
  autoFocus: true,
  openOnFocus: true,
  insights: true,
  plugins: [
    recentSearchesPlugin,
    querySuggestionsPlugin,
    categoriesPlugin,
    brandsPlugin,
    faqPlugin,
    productsPlugin,
    articlesPlugin,
    popularPlugin,
    quickAccessPlugin,
    popularCategoriesPlugin,
  ],
  reshape({ sourcesBySourceId, sources, state }) {
    const {
      recentSearchesPlugin: recentSearches,
      querySuggestionsPlugin: querySuggestions,
      categoriesPlugin: categories,
      brandsPlugin: brands,
      faqPlugin: faq,
      popularPlugin: popular,
      popularCategoriesPlugin: popularCategories,
      ...rest
    } = sourcesBySourceId;

    const sourceIdsToExclude = ['popularPlugin', 'popularCategoriesPlugin'];
    const shouldDisplayPopularCategories = sources.every((source) => {
      if (sourceIdsToExclude.indexOf(source.sourceId) !== -1) {
        return true;
      }
      return source.getItems().length === 0;
    });

    return [
      combine(recentSearches, querySuggestions, categories, brands, faq),
      [
        !state.query && popular,
        ...Object.values(rest),
        shouldDisplayPopularCategories && popularCategories,
      ].filter(Boolean),
    ];
  },
  render({ elements, state, Fragment }, root) {
    const {
      recentSearchesPlugin: recentSearches,
      querySuggestionsPlugin: querySuggestions,
      categoriesPlugin: categories,
      brandsPlugin: brands,
      faqPlugin: faq,
      productsPlugin: products,
      articlesPlugin: articles,
      popularPlugin: popular,
      quickAccessPlugin: quickAccess,
      popularCategoriesPlugin: popularCategories,
    } = elements;

    const sourceIdsToExclude = ['popularPlugin', 'popularCategoriesPlugin'];
    const hasResults =
      state.collections
        .filter(
          ({ source }) => sourceIdsToExclude.indexOf(source.sourceId) === -1
        )
        .reduce((prev, curr) => prev + curr.items.length, 0) > 0;

    render(
      <div className="aa-PanelLayout aa-Panel--scrollable">
        {!hasResults && (
          <div className="aa-NoResultsQuery">
            No results for "{state.query}".
          </div>
        )}

        <div className="aa-PanelSections">
          <div className="aa-PanelSection--left">
            {hasResults ? (
              (!state.query && recentSearches && (
                <Fragment>
                  <div className="aa-SourceHeader">
                    <span className="aa-SourceHeaderTitle">
                      Recent searches
                    </span>
                    <div className="aa-SourceHeaderLine" />
                  </div>
                  {recentSearches}
                </Fragment>
              )) ||
              (state.query && (
                <Fragment>
                  <div className="aa-SourceHeader">
                    <span className="aa-SourceHeaderTitle">Suggestions</span>
                    <div className="aa-SourceHeaderLine" />
                  </div>

                  <div className="aa-PanelSectionSources">
                    {recentSearches}
                    {querySuggestions}
                    {categories}
                    {brands}
                    {faq}
                  </div>
                </Fragment>
              ))
            ) : (
              <div className="aa-NoResultsAdvices">
                <ul className="aa-NoResultsAdvicesList">
                  <li>Double-check your spelling</li>
                  <li>Use fewer keywords</li>
                  <li>Search for a less specific item</li>
                  <li>Try navigate using on the of the popular categories</li>
                </ul>
              </div>
            )}

            {!state.query && (
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

            {quickAccess && (
              <div
                className={cx(
                  'aa-PanelSection--quickAccess aa-PanelSection--zoomable',
                  hasSourceActiveItem('quickAccessPlugin', state) &&
                    'aa-PanelSection--active'
                )}
              >
                {quickAccess}
              </div>
            )}

            {!hasResults && (
              <div
                className={cx(
                  'aa-PanelSection--popularCategories aa-PanelSection--zoomable',
                  hasSourceActiveItem('popularCategoriesPlugin', state) &&
                    'aa-PanelSection--active'
                )}
              >
                {popularCategories}
              </div>
            )}
          </div>
        </div>
      </div>,
      root
    );
  },
});
