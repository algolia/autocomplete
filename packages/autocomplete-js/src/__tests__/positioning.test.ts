import { AutocompletePlugin } from '@algolia/autocomplete-core';
import { waitFor, getByTestId, fireEvent } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { autocomplete } from '../';

import querySuggestions from './fixtures/query-suggestions.json';

type QuerySuggestionFacetMatch = {
  value: string;
  count: number;
};
type QuerySuggestionsHit = {
  instant_search: {
    exact_nb_hits: number;
    facets: {
      exact_matches: {
        categories: QuerySuggestionFacetMatch[];
        'hierarchicalCategories.lvl0': QuerySuggestionFacetMatch[];
        'hierarchicalCategories.lvl1': QuerySuggestionFacetMatch[];
        'hierarchicalCategories.lvl2': QuerySuggestionFacetMatch[];
      };
    };
  };
  nb_words: number;
  popularity: number;
  query: string;
  objectID: string;
};

const querySuggestionsFixturePlugin: AutocompletePlugin<
  QuerySuggestionsHit,
  undefined
> = {
  getSources() {
    return [
      {
        sourceId: 'testSource',
        getItems() {
          return querySuggestions;
        },
        templates: {
          item({ item }) {
            return item.query;
          },
        },
      },
    ];
  },
};

describe('Panel positioning', () => {
  const rootPosition = {
    bottom: 0,
    height: 20,
    left: 300,
    right: 990,
    top: 20,
    width: 600,
    x: 300,
    y: 20,
  };
  const formPosition = {
    bottom: 0,
    height: 20,
    left: 300,
    right: 990,
    top: 20,
    width: 600,
    x: 300,
    y: 20,
  };

  beforeAll(() => {
    Object.defineProperty(document.documentElement, 'clientWidth', {
      writable: true,
      configurable: true,
      value: 1920,
    });
    Object.defineProperty(document.documentElement, 'clientHeight', {
      writable: true,
      configurable: true,
      value: 1080,
    });
  });

  afterAll(() => {
    Object.defineProperty(document.documentElement, 'clientWidth', {
      get() {
        return 0;
      },
    });
    Object.defineProperty(document.documentElement, 'clientHeight', {
      get() {
        return 0;
      },
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  function mockPosition(
    _rootPosition = rootPosition,
    _formPosition = formPosition
  ) {
    const root = document.querySelector<HTMLDivElement>('.aa-Autocomplete');
    root.getBoundingClientRect = jest.fn().mockReturnValue(_rootPosition);
    Object.defineProperty(root, 'offsetLeft', {
      get() {
        return _rootPosition.left;
      },
      configurable: true,
    });
    Object.defineProperty(root, 'offsetTop', {
      get() {
        return _rootPosition.top;
      },
      configurable: true,
    });

    const form = document.querySelector<HTMLFormElement>('.aa-Form');
    form.getBoundingClientRect = jest.fn().mockReturnValue(_formPosition);
    Object.defineProperty(form, 'offsetLeft', {
      get() {
        return _formPosition.left;
      },
      configurable: true,
    });
    Object.defineProperty(form, 'offsetTop', {
      get() {
        return _formPosition.top;
      },
      configurable: true,
    });
  }

  test('positions the panel below the root element', async () => {
    const container = document.createElement('div');
    const panelContainer = document.body;
    document.body.appendChild(container);

    autocomplete({
      id: 'autocomplete-0',
      container,
      panelContainer,
      plugins: [querySuggestionsFixturePlugin],
    });

    mockPosition();

    const input = document.querySelector<HTMLInputElement>('.aa-Input');
    userEvent.type(input, 'a');

    await waitFor(() => getByTestId(panelContainer, 'panel'));

    expect(getByTestId(panelContainer, 'panel')).toHaveStyle({
      top: '40px',
      left: '300px',
      right: '1020px',
    });
  });

  test('keeps the panel positioned after scrolling', async () => {
    const container = document.createElement('div');
    const panelContainer = document.body;
    document.body.appendChild(container);

    autocomplete({
      id: 'autocomplete-0',
      container,
      panelContainer,
      plugins: [querySuggestionsFixturePlugin],
    });

    mockPosition();

    const input = document.querySelector<HTMLInputElement>('.aa-Input');
    userEvent.type(input, 'a');

    fireEvent.scroll(document.body, { target: { scrollTop: 100 } });

    await waitFor(() => getByTestId(panelContainer, 'panel'));

    expect(getByTestId(panelContainer, 'panel')).toHaveStyle({
      top: '140px',
      left: '300px',
      right: '1020px',
    });

    fireEvent.scroll(document.body, { target: { scrollTop: 0 } });
  });

  test('repositions the panel below the root element after a UI change', async () => {
    const container = document.createElement('div');
    const panelContainer = document.body;
    document.body.appendChild(container);

    autocomplete({
      id: 'autocomplete-0',
      container,
      panelContainer,
      plugins: [querySuggestionsFixturePlugin],
    });

    mockPosition();

    const input = document.querySelector<HTMLInputElement>('.aa-Input');
    userEvent.type(input, 'a');

    await waitFor(() => getByTestId(panelContainer, 'panel'));

    expect(getByTestId(panelContainer, 'panel')).toHaveStyle({
      top: '40px',
      left: '300px',
      right: '1020px',
    });

    userEvent.click(document.body);

    // Move the root vertically
    mockPosition({ ...rootPosition, top: 90 });

    input.focus();

    expect(getByTestId(panelContainer, 'panel')).toHaveStyle({
      top: '110px',
      left: '300px',
      right: '1020px',
    });
  });
});
