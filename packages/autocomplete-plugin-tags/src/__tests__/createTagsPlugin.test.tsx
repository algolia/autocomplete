/** @jsx h */
import { fireEvent, waitFor, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { h, render, createElement, Fragment } from 'preact';

import { autocomplete } from '../../../autocomplete-js';
import { createTagsPlugin } from '../createTagsPlugin';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('createTagsPlugin', () => {
  test('adds a tags source', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    const tagsPlugin = createTagsPlugin({
      initialTags: [
        {
          label: 'iPhone 12',
        },
      ],
    });

    autocomplete({
      container,
      panelContainer,
      plugins: [tagsPlugin],
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        within(
          panelContainer.querySelector(
            '[data-autocomplete-source-id="tagsPlugin"]'
          )
        ).getAllByRole('option')
      ).toMatchInlineSnapshot(`
        Array [
          <li
            aria-selected="false"
            class="aa-Item"
            id="autocomplete-0-item-0"
            role="option"
          >
            <div
              class="aa-ItemWrapper"
            >
              <div
                class="aa-ItemContent"
              >
                <div
                  class="aa-ItemIcon aa-ItemIcon--noBorder"
                >
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01"
                    />
                  </svg>
                </div>
                <div
                  class="aa-ItemContentBody"
                >
                  <div
                    class="aa-ItemContentTitle"
                  >
                    <span
                      class="aa-ItemContentLabel"
                    >
                      iPhone 12
                    </span>
                  </div>
                </div>
              </div>
              <div
                class="aa-ItemActions"
              >
                <button
                  class="aa-ItemActionButton"
                  title="Remove this tag"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M18 7v13c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-10c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-13zM17 5v-1c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-4c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1h1v13c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h10c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-13h1c0.552 0 1-0.448 1-1s-0.448-1-1-1zM9 5v-1c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h4c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v1zM9 11v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1zM13 11v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </li>,
        ]
      `);
    });
  });

  test('transforms the tags source', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    const tagsPlugin = createTagsPlugin({
      initialTags: [
        {
          label: 'iPhone 12',
        },
      ],
      transformSource({ source }) {
        return {
          ...source,
          templates: {
            item({ item }) {
              return item.label;
            },
          },
        };
      },
    });

    autocomplete({
      container,
      panelContainer,
      plugins: [tagsPlugin],
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        within(
          panelContainer.querySelector(
            '[data-autocomplete-source-id="tagsPlugin"]'
          )
        ).getAllByRole('option')
      ).toMatchInlineSnapshot(`
        Array [
          <li
            aria-selected="false"
            class="aa-Item"
            id="autocomplete-1-item-0"
            role="option"
          >
            iPhone 12
          </li>,
        ]
      `);
    });
  });

  test('fully customizes tags rendering', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    const tagsPlugin = createTagsPlugin({
      initialTags: [
        {
          label: 'iPhone 12',
        },
      ],
      transformSource() {
        return null;
      },
    });

    autocomplete({
      container,
      panelContainer,
      renderer: { createElement, Fragment },
      getSources() {
        return [
          {
            sourceId: 'filters',
            getItems() {
              return [
                {
                  label: 'iPhone 12',
                },
                {
                  label: 'Samsung Galaxy S',
                },
              ];
            },
            templates: {
              item({ item }) {
                return item.label as string;
              },
            },
          },
        ];
      },
      plugins: [tagsPlugin],
      render({ sections, state }, root) {
        render(
          <div className="aa-PanelLayout aa-Panel--scrollable">
            <button onClick={() => state.context.tagsPlugin.setTags([])}>
              Clear all
            </button>
            <h2>Filters</h2>
            <ul>
              {state.context.tagsPlugin.tags.map((tag) => (
                <li
                  key={tag.label}
                  aria-label={`Filter: ${tag.label}`}
                  onClick={() => tag.remove()}
                >
                  Filter: {tag.label}
                </li>
              ))}
            </ul>
            <h2>Suggestions</h2>
            <ul>
              <li aria-label="Suggestion: Samsung Galaxy S">
                <button
                  onClick={() =>
                    state.context.tagsPlugin.addTags([
                      { label: 'Samsung Galaxy S' },
                    ])
                  }
                >
                  Suggestion: Samsung Galaxy S
                </button>
              </li>
            </ul>
            <div>{sections}</div>
          </div>,
          root
        );
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        document.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        panelContainer.querySelector(
          '[data-autocomplete-source-id="tagsPlugin"]'
        )
      ).toBeNull();
    });

    await waitFor(() => {
      expect(
        within(panelContainer).getByRole('listitem', {
          name: 'Filter: iPhone 12',
        })
      ).toBeInTheDocument();
    });

    userEvent.click(
      within(panelContainer).getByRole('button', {
        name: 'Suggestion: Samsung Galaxy S',
      })
    );

    await waitFor(() => {
      expect(
        within(panelContainer).getByRole('listitem', {
          name: 'Filter: Samsung Galaxy S',
        })
      ).toBeInTheDocument();
    });

    userEvent.click(
      within(panelContainer).getByRole('button', { name: 'Clear all' })
    );

    await waitFor(() => {
      expect(
        within(panelContainer).queryByRole('listitem', {
          name: 'Filter: iPhone 12',
        })
      ).toBeNull();
    });
  });

  test('returns the tags', () => {
    const tagsPlugin = createTagsPlugin({
      initialTags: [
        {
          label: 'iPhone 12',
        },
      ],
    });

    expect(tagsPlugin.data.tags).toEqual([
      expect.objectContaining({ label: 'iPhone 12' }),
    ]);
  });

  test('adds tags', () => {
    const tagsPlugin = createTagsPlugin({
      initialTags: [
        {
          label: 'iPhone 12',
        },
      ],
    });

    tagsPlugin.data.addTags([{ label: 'Samsung Galaxy S' }]);

    expect(tagsPlugin.data.tags).toEqual([
      expect.objectContaining({ label: 'iPhone 12' }),
      expect.objectContaining({ label: 'Samsung Galaxy S' }),
    ]);
  });

  test('sets tags', () => {
    const tagsPlugin = createTagsPlugin({
      initialTags: [
        {
          label: 'iPhone 12',
        },
      ],
    });

    tagsPlugin.data.setTags([{ label: 'Samsung Galaxy S' }]);

    expect(tagsPlugin.data.tags).toEqual([
      expect.objectContaining({ label: 'Samsung Galaxy S' }),
    ]);
  });

  test('runs a callback when tags change', () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    const onChange = jest.fn();

    const tagsPlugin = createTagsPlugin({
      initialTags: [
        {
          label: 'iPhone 12',
        },
      ],
      onChange,
    });

    autocomplete({
      container,
      panelContainer,
      plugins: [tagsPlugin],
    });

    tagsPlugin.data.addTags([{ label: 'Samsung Galaxy S' }]);

    expect(onChange).toHaveBeenNthCalledWith(1, {
      onActive: expect.any(Function),
      onSelect: expect.any(Function),
      refresh: expect.any(Function),
      setActiveItemId: expect.any(Function),
      setCollections: expect.any(Function),
      setContext: expect.any(Function),
      setIsOpen: expect.any(Function),
      setQuery: expect.any(Function),
      setStatus: expect.any(Function),
      prevTags: [
        {
          label: 'iPhone 12',
          remove: expect.any(Function),
        },
      ],
      tags: [
        {
          label: 'iPhone 12',
          remove: expect.any(Function),
        },
        {
          label: 'Samsung Galaxy S',
          remove: expect.any(Function),
        },
      ],
    });
  });

  test('adds a tag on subscriber item select then removes a tag on tags source item select', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    const tagsPlugin = createTagsPlugin({
      getTagsSubscribers() {
        return [
          {
            sourceId: 'filters',
            getTag({ item }) {
              return {
                label: `Filter: ${item.label}`,
              };
            },
          },
        ];
      },
    });

    autocomplete({
      container,
      panelContainer,
      getSources() {
        return [
          {
            sourceId: 'filters',
            getItems() {
              return [
                {
                  label: 'iPhone 12',
                },
                {
                  label: 'Samsung Galaxy S',
                },
              ];
            },
            templates: {
              item({ item }) {
                return item.label as string;
              },
            },
          },
        ];
      },
      plugins: [tagsPlugin],
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        document.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();
    });

    userEvent.click(
      within(
        panelContainer.querySelector('[data-autocomplete-source-id="filters"]')
      ).getByRole('option', { name: 'iPhone 12' })
    );

    await waitFor(() => {
      expect(
        within(
          panelContainer.querySelector(
            '[data-autocomplete-source-id="tagsPlugin"]'
          )
        )
          .getAllByRole('option')
          .map((node) => node.textContent)
      ).toEqual(['Filter: iPhone 12']);
    });

    userEvent.click(
      within(
        panelContainer.querySelector(
          '[data-autocomplete-source-id="tagsPlugin"]'
        )
      ).getByRole('option', { name: 'Filter: iPhone 12' })
    );

    await waitFor(() => {
      expect(
        panelContainer.querySelector(
          '[data-autocomplete-source-id="tagsPlugin"]'
        )
      ).toBeNull();
    });
  });

  test('keeps the panel open on tags update', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    const tagsPlugin = createTagsPlugin({
      initialTags: [
        {
          label: 'iPhone 12',
        },
      ],
    });

    autocomplete({
      container,
      panelContainer,
      plugins: [tagsPlugin],
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        document.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();
    });

    tagsPlugin.data.addTags([{ label: 'Samsung Galaxy S' }]);

    await waitFor(() => {
      expect(
        within(
          panelContainer.querySelector(
            '[data-autocomplete-source-id="tagsPlugin"]'
          )
        )
          .getAllByRole('option')
          .map((node) => node.textContent)
      ).toEqual(['iPhone 12', 'Samsung Galaxy S']);
    });
  });
});
