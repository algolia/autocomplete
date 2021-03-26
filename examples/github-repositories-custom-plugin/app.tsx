import { autocomplete } from '@algolia/autocomplete-js';
import { createGitHubReposPlugin } from './createGitHubReposPlugin';

import '@algolia/autocomplete-theme-classic';

const gitHubReposPlugin = createGitHubReposPlugin({
  per_page: 5,
});

autocomplete({
  container: '#autocomplete',
  plugins: [gitHubReposPlugin],
});
