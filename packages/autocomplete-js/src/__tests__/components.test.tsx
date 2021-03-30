/** @jsx h */
import { Hit } from '@algolia/client-search';
import { fireEvent, waitFor } from '@testing-library/dom';
import { h } from 'preact';

import { createSource } from '../../../../test/utils';
import { autocomplete } from '../autocomplete';

import products from './fixtures/products.json';

type ProductRecord = {
  brand: string;
  categories: string[];
  description: string;
  free_shipping: boolean;
  hierarchicalCategories: {
    lvl0: string;
    lvl1?: string;
    lvl2?: string;
    lvl3?: string;
    lvl4?: string;
    lvl5?: string;
    lvl6?: string;
  };
  image: string;
  name: string;
  popularity: number;
  price: number;
  prince_range: string;
  rating: number;
  type: string;
};
type ProductHit = Hit<ProductRecord>;

const productHits = products.results[0].hits;

describe('components', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('provides Highlight component', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete<ProductHit>({
      container,
      panelContainer,
      getSources() {
        return [
          {
            ...createSource({
              getItems() {
                return productHits;
              },
            }),
            templates: {
              item({ item, components }) {
                return <components.Highlight hit={item} attribute="name" />;
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');
    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Item').innerHTML
      ).toMatchInlineSnapshot(
        `"Apple - <mark>iPhone</mark> SE 16GB - Space Gray (Verizon)"`
      );
    });
  });

  test('provides Highlight component that accepts tagName', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete<ProductHit>({
      container,
      panelContainer,
      getSources() {
        return [
          {
            ...createSource({
              getItems() {
                return productHits;
              },
            }),
            templates: {
              item({ item, components }) {
                return (
                  <components.Highlight
                    hit={item}
                    attribute="name"
                    tagName="em"
                  />
                );
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');
    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Item').innerHTML
      ).toMatchInlineSnapshot(
        `"Apple - <em>iPhone</em> SE 16GB - Space Gray (Verizon)"`
      );
    });
  });

  test.todo('provides Highlight component with custom createElement');

  test('provides Snippet component', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete<ProductHit>({
      container,
      panelContainer,
      getSources() {
        return [
          {
            ...createSource({
              getItems() {
                return productHits;
              },
            }),
            templates: {
              item({ item, components }) {
                return <components.Snippet hit={item} attribute="name" />;
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');
    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Item').innerHTML
      ).toMatchInlineSnapshot(
        `"Apple - <mark>iPhone</mark> SE 16GB - Space Gray (Verizon)"`
      );
    });
  });

  test('provides Snippet component that accepts tagName', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete<ProductHit>({
      container,
      panelContainer,
      getSources() {
        return [
          {
            ...createSource({
              getItems() {
                return productHits;
              },
            }),
            templates: {
              item({ item, components }) {
                return (
                  <components.Snippet
                    hit={item}
                    attribute="name"
                    tagName="em"
                  />
                );
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');
    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Item').innerHTML
      ).toMatchInlineSnapshot(
        `"Apple - <em>iPhone</em> SE 16GB - Space Gray (Verizon)"`
      );
    });
  });

  test.todo('provides Snippet component with custom createElement');

  test('provides ReverseHighlight component', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete<ProductHit>({
      container,
      panelContainer,
      getSources() {
        return [
          {
            ...createSource({
              getItems() {
                return productHits;
              },
            }),
            templates: {
              item({ item, components }) {
                return (
                  <components.ReverseHighlight hit={item} attribute="name" />
                );
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');
    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Item').innerHTML
      ).toMatchInlineSnapshot(
        `"<mark>Apple - </mark>iPhone<mark> SE 16GB - Space Gray (Verizon)</mark>"`
      );
    });
  });

  test('provides ReverseHighlight component that accepts tagName', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete<ProductHit>({
      container,
      panelContainer,
      getSources() {
        return [
          {
            ...createSource({
              getItems() {
                return productHits;
              },
            }),
            templates: {
              item({ item, components }) {
                return (
                  <components.ReverseHighlight
                    hit={item}
                    attribute="name"
                    tagName="em"
                  />
                );
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');
    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Item').innerHTML
      ).toMatchInlineSnapshot(
        `"<em>Apple - </em>iPhone<em> SE 16GB - Space Gray (Verizon)</em>"`
      );
    });
  });

  test.todo('provides ReverseHighlight component with custom createElement');

  test('provides ReverseSnippet component', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete<ProductHit>({
      container,
      panelContainer,
      getSources() {
        return [
          {
            ...createSource({
              getItems() {
                return productHits;
              },
            }),
            templates: {
              item({ item, components }) {
                return (
                  <components.ReverseSnippet hit={item} attribute="name" />
                );
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');
    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Item').innerHTML
      ).toMatchInlineSnapshot(
        `"<mark>Apple - </mark>iPhone<mark> SE 16GB - Space Gray (Verizon)</mark>"`
      );
    });
  });

  test('provides ReverseSnippet component that accepts tagName', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete<ProductHit>({
      container,
      panelContainer,
      getSources() {
        return [
          {
            ...createSource({
              getItems() {
                return productHits;
              },
            }),
            templates: {
              item({ item, components }) {
                return (
                  <components.ReverseSnippet
                    hit={item}
                    attribute="name"
                    tagName="em"
                  />
                );
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');
    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Item').innerHTML
      ).toMatchInlineSnapshot(
        `"<em>Apple - </em>iPhone<em> SE 16GB - Space Gray (Verizon)</em>"`
      );
    });
  });

  test.todo('provides ReverseSnippet component with custom createElement');

  test('allows registering custom components', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    function CustomComponent({ children }) {
      return children;
    }

    document.body.appendChild(panelContainer);
    autocomplete<ProductHit>({
      container,
      panelContainer,
      components: {
        CustomComponent,
      },
      getSources() {
        return [
          {
            ...createSource({
              getItems() {
                return productHits;
              },
            }),
            templates: {
              item({ item, components }) {
                return (
                  <components.CustomComponent>
                    {item.name}
                  </components.CustomComponent>
                );
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');
    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Item').innerHTML
      ).toMatchInlineSnapshot(
        `"Apple - iPhone SE 16GB - Space Gray (Verizon)"`
      );
    });
  });
});
