import { createAlgoliaInsightsPlugin } from '@algolia/autocomplete-plugin-algolia-insights';
import { noop, version } from '@algolia/autocomplete-shared';
import insightsClient from 'search-insights';

import { createPlayground, defer } from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';

beforeEach(() => {
  document.head.innerHTML = '';
});

const algoliaCrawlerEnvironment = createEnvironmentWithUserAgent(
  'Algolia Crawler 2.303.5'
);

describe('metadata', () => {
  test('does not enable metadata with regular user agents', async () => {
    createPlayground(createAutocomplete, {
      environment: createEnvironmentWithUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:93.0) Gecko/20100101 Firefox/93.0'
      ),
    });

    await defer(noop, 0);

    expect(document.head).toMatchInlineSnapshot(`<head />`);
  });

  test('does not enable metadata with no window', async () => {
    createPlayground(createAutocomplete, {
      environment: {},
    });

    await defer(noop, 0);

    expect(document.head).toMatchInlineSnapshot(`<head />`);
  });

  test('does not enable metadata with a window but no navigator', async () => {
    createPlayground(createAutocomplete, {
      environment: {
        ...createEnvironmentWithUserAgent(),
        navigator: undefined,
      },
    });

    await defer(noop, 0);

    expect(document.head).toMatchInlineSnapshot(`<head />`);
  });

  test("does not enable metadata when navigator is different from browser's (React Native)", async () => {
    createPlayground(createAutocomplete, {
      environment: createEnvironmentWithUserAgent(),
    });

    await defer(noop, 0);

    expect(document.head).toMatchInlineSnapshot(`<head />`);
  });

  test('enables metadata with Algolia Crawler user agents', async () => {
    createPlayground(createAutocomplete, {
      environment: algoliaCrawlerEnvironment,
    });

    await defer(noop, 0);

    expect(
      JSON.parse(
        document.head.querySelector<HTMLMetaElement>(
          'meta[name="algolia:metadata"]'
        ).content
      )
    ).toEqual({
      options: { 'autocomplete-core': ['environment', 'onStateChange'] },
      plugins: [],
      ua: [{ segment: 'autocomplete-core', version }],
    });
  });

  test('exposes user agents', async () => {
    createPlayground(createAutocomplete, {
      environment: algoliaCrawlerEnvironment,
    });

    await defer(noop, 0);

    expect(
      JSON.parse(
        document.head.querySelector<HTMLMetaElement>(
          'meta[name="algolia:metadata"]'
        ).content
      ).ua
    ).toEqual([{ segment: 'autocomplete-core', version }]);
  });

  test('exposes passed options', async () => {
    createPlayground(createAutocomplete, {
      openOnFocus: true,
      placeholder: 'Start searching',
      environment: algoliaCrawlerEnvironment,
    });

    await defer(noop, 0);

    expect(
      JSON.parse(
        document.head.querySelector<HTMLMetaElement>(
          'meta[name="algolia:metadata"]'
        ).content
      ).options
    ).toEqual({
      'autocomplete-core': [
        'openOnFocus',
        'placeholder',
        'environment',
        'onStateChange',
      ],
    });
  });

  test('exposes passed plugins and their passed options', async () => {
    const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({
      insightsClient,
      onItemsChange: noop,
    });

    createPlayground(createAutocomplete, {
      environment: algoliaCrawlerEnvironment,
      plugins: [algoliaInsightsPlugin],
    });

    await defer(noop, 0);

    expect(
      JSON.parse(
        document.head.querySelector<HTMLMetaElement>(
          'meta[name="algolia:metadata"]'
        ).content
      ).plugins
    ).toEqual([
      {
        name: 'aa.algoliaInsightsPlugin',
        options: ['insightsClient', 'onItemsChange'],
      },
    ]);
  });

  test('exposes custom plugins', async () => {
    createPlayground(createAutocomplete, {
      environment: algoliaCrawlerEnvironment,
      plugins: [
        {
          name: 'customPlugin',
        },
      ],
    });

    await defer(noop, 0);

    expect(
      JSON.parse(
        document.head.querySelector<HTMLMetaElement>(
          'meta[name="algolia:metadata"]'
        ).content
      ).plugins
    ).toEqual([{ name: 'customPlugin', options: [] }]);
  });

  test('does not set a fallback name for unnamed custom plugins', async () => {
    createPlayground(createAutocomplete, {
      environment: algoliaCrawlerEnvironment,
      plugins: [{}],
    });

    await defer(noop, 0);

    expect(
      JSON.parse(
        document.head.querySelector<HTMLMetaElement>(
          'meta[name="algolia:metadata"]'
        ).content
      ).plugins
    ).toEqual([{ options: [] }]);
  });
});

function createEnvironmentWithUserAgent(userAgent?: string) {
  return {
    ...global,
    navigator: {
      ...global.navigator,
      userAgent,
    },
  };
}
