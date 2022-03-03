/** @jsx h */
import { autocomplete } from '@algolia/autocomplete-js';
import { h, render } from 'preact';
import { pipe } from 'ramda';

import { FaqPreview } from './components/FaqPreview';
import { populate, uniqBy } from './functions';
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
import { FaqHit } from './types';
import { cx } from './utils';

import '@algolia/autocomplete-theme-classic';

const removeDuplicates = uniqBy(({ source, item }) => {
  if (
    ['recentSearchesPlugin', 'querySuggestionsPlugin'].indexOf(
      source.sourceId
    ) === -1
  ) {
    return item;
  }

  return source.sourceId === 'querySuggestionsPlugin' ? item.query : item.label;
});

const fillWith = populate({
  mainSourceId: 'querySuggestionsPlugin',
  limit: 8,
});

const combine = pipe(removeDuplicates, fillWith);

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
    quickAccessPlugin,
    popularCategoriesPlugin,
  ],
  getInputProps({ props, setContext }) {
    return {
      ...props,
      onChange(event) {
        setContext({ preview: null });
        props.onChange(event);
      },
    };
  },
  reshape({ sourcesBySourceId }) {
    const {
      recentSearchesPlugin: recentSearches,
      querySuggestionsPlugin: querySuggestions,
      categoriesPlugin: categories,
      brandsPlugin: brands,
      faqPlugin: faq,
      ...rest
    } = sourcesBySourceId;

    return [
      combine(recentSearches, querySuggestions, categories, brands, faq),
      Object.values(rest),
    ];
  },
  render({ elements, components, state, setContext, refresh, Fragment }, root) {
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

    const hasResults =
      state.collections
        .filter(
          ({ source }) =>
            source.sourceId !== 'popularPlugin' &&
            source.sourceId !== 'popularCategoriesPlugin'
        )
        .reduce((prev, curr) => prev + curr.items.length, 0) > 0;

    const previewContext = state.context.preview;

    render(
      <div
        className="aa-PanelLayout aa-Panel--scrollable"
        onMouseLeave={() => {
          const el = document.querySelector('[data-active=true]');
          el?.removeAttribute('data-active');

          setContext({ preview: null });
          refresh();
        }}
      >
        {!hasResults && (
          <div className="aa-NoResultsQuery">
            Sorry, we didn't find any matches for "{state.query}"
          </div>
        )}

        <div className="aa-PanelSections">
          <div className="aa-PanelSection--left">
            {hasResults ? (
              <Fragment>
                {recentSearches}
                {querySuggestions}
                {categories}
                {brands}
                {faq}
              </Fragment>
            ) : (
              <div className="aa-NoResultsAdvices">
                <div className="aa-NoResultsAdvicesTitle">
                  Try the following:
                </div>
                <ul className="aa-NoResultsAdvicesList">
                  <li>Double check your spelling</li>
                  <li>Use fewer keywords</li>
                  <li>
                    Search fo an item that is less specific and refine results
                  </li>
                </ul>
              </div>
            )}

            {(!hasResults || !state.query) && (
              <div className="aa-PanelSection--popular">{popular}</div>
            )}
          </div>
          <div className="aa-PanelSection--right">
            {(previewContext as FaqHit)?.title ? (
              <FaqPreview
                hit={previewContext as FaqHit}
                components={components}
              />
            ) : (
              <Fragment>
                {products && (
                  <div
                    className={cx(
                      'aa-PanelSection--products',
                      previewContext && 'aa-PanelSection--products-preview'
                    )}
                  >
                    <div className="aa-PanelSectionSource">{products}</div>
                  </div>
                )}
                {articles && (
                  <div className="aa-PanelSection--articles">
                    <div className="aa-PanelSectionSource">{articles}</div>
                  </div>
                )}
              </Fragment>
            )}

            {quickAccess && (
              <div className="aa-PanelSection--quickAccess">{quickAccess}</div>
            )}

            {!hasResults && (
              <div className="aa-PanelSection--popularCategories">
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
