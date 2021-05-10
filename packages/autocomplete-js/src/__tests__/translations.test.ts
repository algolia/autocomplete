import { fireEvent, waitFor } from '@testing-library/dom';

import { autocomplete } from '../autocomplete';

describe('translations', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

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

    const ac = autocomplete<{ label: string }>({
      container,
      detachedMediaQuery: '',
    });

    const searchButton = container.querySelector<HTMLButtonElement>(
      '.aa-DetachedSearchButton'
    );

    searchButton.click();

    await waitFor(() => {
      const input = document.querySelector<HTMLInputElement>('.aa-Input');

      expect(document.querySelector('.aa-DetachedOverlay')).toBeInTheDocument();

      fireEvent.input(input, { target: { value: 'a' } });
    });

    expect(
      document.querySelector<HTMLButtonElement>('.aa-DetachedCancelButton')
    ).toHaveTextContent('Cancel');
    expect(
      document.querySelector<HTMLButtonElement>('.aa-ClearButton')
    ).toHaveAttribute('title', 'Clear');
    expect(
      document.querySelector<HTMLButtonElement>('.aa-SubmitButton')
    ).toHaveAttribute('title', 'Submit');

    ac.destroy();
  });

  test('allows custom translations', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const ac = autocomplete({
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
      const input = document.querySelector<HTMLInputElement>('.aa-Input');

      expect(document.querySelector('.aa-DetachedOverlay')).toBeInTheDocument();

      fireEvent.input(input, { target: { value: 'a' } });
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

    ac.destroy();
  });
});
