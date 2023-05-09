/** @jsx h */
import { autocomplete } from '@algolia/autocomplete-js';
import { fireEvent, waitFor, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { h, render, createElement, Fragment } from 'preact';

import { createTagsPlugin } from '../createTagsPlugin';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('createTagsPlugin', () => {
  test('has a name', () => {
    const tagsPlugin = createTagsPlugin();

    expect(tagsPlugin.name).toBe('aa.tagsPlugin');
  });

  test('exposes passed options and excludes default ones', () => {
    const tagsPlugin = createTagsPlugin({
      initialTags: [],
    });

    expect(tagsPlugin.__autocomplete_pluginOptions).toEqual({
      initialTags: expect.any(Array),
    });
  });

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
        )
          .getAllByRole('option')
          .map((option) => option.children)
      ).toMatchInlineSnapshot(`
        Array [
          HTMLCollection [
            <div
              class="aa-TagsPlugin-Tag"
            >
              <span
                class="aa-TagsPlugin-TagLabel"
              >
                iPhone 12
              </span>
              <button
                class="aa-TagsPlugin-RemoveButton"
                title="Remove this tag"
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
                    d="M18 6L6 18"
                  />
                  <path
                    d="M6 6L18 18"
                  />
                </svg>
              </button>
            </div>,
          ],
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
        )
          .getAllByRole('option')
          .map((option) => option.textContent)
      ).toEqual(['iPhone 12']);
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
      onResolve: expect.any(Function),
      onSelect: expect.any(Function),
      navigator: expect.any(Object),
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
