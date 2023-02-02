/** @jsxRuntime classic */
/** @jsx h */
import { AutocompleteState } from '@algolia/autocomplete-js';
import { ComponentChildren, h } from 'preact';

import { AutocompleteItem } from '../types';

type PanelLayoutProps = {
  state: AutocompleteState<AutocompleteItem>;
  children: ComponentChildren;
};

export function PanelLayout({ state, children }: PanelLayoutProps) {
  const hasResults = state.collections.some(({ items }) => items.length > 0);

  return (
    <div
      className={[
        'aa-PanelLayout aa-Panel--scrollable',
        !hasResults && 'aa-PanelLayout--noResults',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
