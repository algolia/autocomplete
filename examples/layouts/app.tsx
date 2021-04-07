/** @jsx h */
import { autocomplete } from '@algolia/autocomplete-js';
import {
  NavigationCommandsLayout,
  SearchByAlgoliaLayout,
} from '@algolia/autocomplete-layout-classic';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import algoliasearch from 'algoliasearch/lite';
import { h, render } from 'preact';

import '@algolia/autocomplete-theme-classic';

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const searchClient = algoliasearch(appId, apiKey);

const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',
  getSearchParams() {
    return {
      hitsPerPage: 10,
    };
  },
});

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search',
  openOnFocus: true,
  debug: true,
  plugins: [querySuggestionsPlugin],
  render({ sections, createElement, Fragment }, root) {
    render(
      <Fragment>
        <div className="aa-PanelLayout aa-Panel--scrollable">{sections}</div>
        <footer className="aa-PanelFooter">
          {NavigationCommandsLayout({
            createElement,
            Fragment,
            translations: {
              toClose: 'pour fermer',
              toNavigate: 'pour naviguer',
              toSelect: 'pour sélectionner',
            },
          })}
          {SearchByAlgoliaLayout({
            createElement,
            Fragment,
            translations: {
              searchBy: 'Recherche par',
            },
          })}
        </footer>
      </Fragment>,
      root
    );
  },
});
