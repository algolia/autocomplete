import { waitFor } from '@testing-library/dom';

import { autocomplete } from '../autocomplete';

describe('translations', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('regular DOM', () => {
    test('provides default translations', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      autocomplete<{ label: string }>({
        container,
      });

      expect(
        document.querySelector<HTMLButtonElement>('.aa-ClearButton')
      ).toHaveAttribute('title', 'Clear');
      expect(
        document.querySelector<HTMLButtonElement>('.aa-SubmitButton')
      ).toHaveAttribute('title', 'Submit');
    });

    test('allows custom translations', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      autocomplete<{ label: string }>({
        container,
        translations: {
          clearButtonTitle: 'Effacer',
          submitButtonTitle: 'Envoyer',
        },
      });

      expect(
        document.querySelector<HTMLButtonElement>('.aa-ClearButton')
      ).toHaveAttribute('title', 'Effacer');
      expect(
        document.querySelector<HTMLButtonElement>('.aa-SubmitButton')
      ).toHaveAttribute('title', 'Envoyer');
    });
  });

  describe('detached DOM', () => {
    const originalMatchMedia = window.matchMedia;

    beforeAll(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn((query) => ({
          matches: true,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
    });

    afterAll(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: originalMatchMedia,
      });
    });

    test('provides default translations', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const { destroy } = autocomplete<{ label: string }>({
        container,
        detachedMediaQuery: '',
      });

      const searchButton = container.querySelector<HTMLButtonElement>(
        '.aa-DetachedSearchButton'
      );

      searchButton.click();

      await waitFor(() => {
        expect(
          document.querySelector('.aa-DetachedOverlay')
        ).toBeInTheDocument();
      });

      expect(
        document.querySelector<HTMLButtonElement>('.aa-ClearButton')
      ).toHaveAttribute('title', 'Clear');
      expect(
        document.querySelector<HTMLButtonElement>('.aa-SubmitButton')
      ).toHaveAttribute('title', 'Submit');
      expect(
        document.querySelector<HTMLButtonElement>('.aa-DetachedCancelButton')
      ).toHaveTextContent('Cancel');

      destroy();
    });

    test('allows custom translations', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const { destroy } = autocomplete({
        container,
        detachedMediaQuery: '',
        translations: {
          clearButtonTitle: 'Effacer',
          detachedCancelButtonText: 'Annuler',
          submitButtonTitle: 'Envoyer',
        },
      });

      const searchButton = container.querySelector<HTMLButtonElement>(
        '.aa-DetachedSearchButton'
      );

      searchButton.click();

      await waitFor(() => {
        expect(
          document.querySelector('.aa-DetachedOverlay')
        ).toBeInTheDocument();
      });

      expect(
        document.querySelector<HTMLButtonElement>('.aa-ClearButton')
      ).toHaveAttribute('title', 'Effacer');
      expect(
        document.querySelector<HTMLButtonElement>('.aa-SubmitButton')
      ).toHaveAttribute('title', 'Envoyer');
      expect(
        document.querySelector<HTMLButtonElement>('.aa-DetachedCancelButton')
      ).toHaveTextContent('Annuler');

      destroy();
    });
  });
});
