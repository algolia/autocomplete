import { noop, version } from '@algolia/autocomplete-shared';

import { createSource, defer } from '../../../../test/utils';
import { autocomplete } from '../autocomplete';

const { window } = global;

Object.defineProperty(
  window.navigator,
  'userAgent',
  ((value) => ({
    get() {
      return value;
    },
    set(newValue: string) {
      value = newValue;
    },
  }))(window.navigator.userAgent)
);

const algoliaCrawlerUserAgent = 'Algolia Crawler 2.303.5';

beforeEach(() => {
  document.head.innerHTML = '';
});

describe('metadata', () => {
  test('does not enable metadata with regular user agents', async () => {
    // @ts-expect-error
    global.navigator.userAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:93.0) Gecko/20100101 Firefox/93.0';

    const container = document.createElement('div');
    autocomplete<{ label: string }>({
      container,
    });

    await defer(noop, 0);

    expect(document.head).toMatchInlineSnapshot(`<head />`);
  });

  test('exposes user agents', async () => {
    // @ts-expect-error
    global.navigator.userAgent = algoliaCrawlerUserAgent;

    const container = document.createElement('div');
    autocomplete<{ label: string }>({
      container,
      getSources() {
        return [createSource()];
      },
    });

    await defer(noop, 0);

    expect(
      JSON.parse(
        document.head.querySelector<HTMLMetaElement>(
          'meta[name="algolia:metadata"]'
        ).content
      ).ua
    ).toEqual([
      {
        segment: 'autocomplete-core',
        version,
      },
      {
        segment: 'autocomplete-js',
        version,
      },
    ]);
  });

  test('exposes passed options', async () => {
    // @ts-expect-error
    global.navigator.userAgent = algoliaCrawlerUserAgent;

    const container = document.createElement('div');
    autocomplete<{ label: string }>({
      id: 'autocomplete',
      container,
      getSources: () => [],
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
        'id',
        'getSources',
        'environment',
        'onStateChange',
        'shouldPanelOpen',
        '__autocomplete_metadata',
      ],
      'autocomplete-js': ['id', 'container', 'getSources'],
    });
  });
});
