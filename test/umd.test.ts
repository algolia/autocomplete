import { readFileSync } from 'fs';
import { resolve } from 'path';

import { JSDOM } from 'jsdom';

describe('UMD bundle', () => {
  test.each([
    'autocomplete-core',
    'autocomplete-js',
    'autocomplete-plugin-algolia-insights',
    'autocomplete-plugin-query-suggestions',
    'autocomplete-plugin-recent-searches',
    'autocomplete-plugin-redirect-url',
    'autocomplete-plugin-tags',
    'autocomplete-preset-algolia',
  ])('%s loads successfully', (name) => {
    const bundle = readFileSync(
      resolve(process.cwd(), `packages/${name}/dist/umd/index.production.js`),
      'utf8'
    );

    const { window } = new JSDOM('', { runScripts: 'dangerously' });

    const errorFn = jest.fn();
    window.addEventListener('error', errorFn);

    const script = window.document.createElement('script');
    script.textContent = bundle;
    window.document.body.appendChild(script);

    expect(errorFn).not.toHaveBeenCalled();
    expect(window[`@algolia/${name}`]).toBeDefined();
  });
});
