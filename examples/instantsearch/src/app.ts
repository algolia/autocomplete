import '@algolia/autocomplete-theme-classic';
import '../style.css';

import { autocompleteSearch } from './autocomplete';
import { search, getInstantSearchUiState } from './instantsearch';

search.start();
const searchPageState = getInstantSearchUiState();

if (searchPageState.query) {
  autocompleteSearch.setQuery(searchPageState.query);
}
