import algoliasearch from 'algoliasearch/lite';
import {
  Configure,
  HierarchicalMenu,
  Hits,
  InstantSearch,
  Pagination,
} from 'react-instantsearch';

import { Autocomplete, Hit } from './components';
import {
  INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES,
  INSTANT_SEARCH_INDEX_NAME,
} from './constants';
import { Panel } from './widgets/Panel';

import './App.css';

function App() {
  const searchClient = algoliasearch(
    'latency',
    '6be0576ff61c053d5f9a3225e2a90f76'
  );

  return (
    <div>
      <InstantSearch
        searchClient={searchClient}
        indexName={INSTANT_SEARCH_INDEX_NAME}
        routing
      >
        <header className="header">
          <div className="header-wrapper wrapper">
            <nav className="header-nav">
              <a href="/">Home</a>
            </nav>
            <Autocomplete
              searchClient={searchClient}
              placeholder="Search products"
              detachedMediaQuery="none"
              openOnFocus
            />
          </div>
        </header>

        <Configure
          attributesToSnippet={['name:7', 'description:15']}
          snippetEllipsisText="…"
        />
        <div className="container wrapper">
          <div>
            <Panel header="Categories">
              <HierarchicalMenu
                attributes={INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES}
              />
            </Panel>
          </div>
          <div>
            <Hits hitComponent={Hit} />
            <Pagination />
          </div>
        </div>
      </InstantSearch>
    </div>
  );
}

export default App;
