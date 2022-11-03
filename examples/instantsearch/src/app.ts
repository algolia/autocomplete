import '@algolia/autocomplete-theme-classic';
import '../style.css';

import { startAutocomplete } from './autocomplete';
import { search } from './instantsearch';

search.start();
startAutocomplete(search);
