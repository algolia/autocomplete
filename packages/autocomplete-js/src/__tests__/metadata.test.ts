import { noop } from '@algolia/autocomplete-shared';

import { defer } from '../../../../test/utils';
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
      id: 'autocomplete',
      container,
      getSources() {
        return [
          {
            sourceId: 'testSource',
            getItems() {
              return [
                { label: 'Item 1' },
                { label: 'Item 2' },
                { label: 'Item 3' },
              ];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
            },
          },
        ];
      },
    });

    await defer(noop, 0);

    expect(
      JSON.parse(document.head.querySelector('meta').content).ua
    ).toMatchInlineSnapshot(
      [{ version: expect.any(String) }, { version: expect.any(String) }],
      `
      Array [
        Object {
          "segment": "autocomplete-core",
          "version": Any<String>,
        },
        Object {
          "segment": "autocomplete-js",
          "version": Any<String>,
        },
      ]
    `
    );
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

    expect(JSON.parse(document.head.querySelector('meta').content).options)
      .toMatchInlineSnapshot(`
      Object {
        "core": Array [
          "id",
          "getSources",
          "environment",
          "onStateChange",
          "shouldPanelOpen",
          "__autocomplete_metadata",
        ],
        "js": Array [
          "id",
          "container",
          "getSources",
        ],
      }
    `);
  });
});
