import {
  AutocompleteScopeApi,
  AutocompleteState,
  BaseItem,
} from '@algolia/autocomplete-core';
import { dequal } from 'dequal/lite';

import { isTouchDevice } from '../utils';

type smartPreviewParams<
  TItem extends BaseItem
> = AutocompleteScopeApi<TItem> & {
  state: AutocompleteState<TItem>;
  preview: {
    [key: string]: unknown;
  };
};

export const updateActiveItem = (activeItemId: number) => {
  const currentActiveEl = document.querySelector('[data-active=true]');
  currentActiveEl?.removeAttribute('data-active');

  const selectedEl = document.querySelector(
    `#autocomplete-0-item-${activeItemId}`
  );
  selectedEl?.setAttribute('data-active', 'true');
};

export const setSmartPreview = <TItem extends BaseItem>({
  state,
  setContext,
  refresh,
  preview,
  setActiveItemId,
}: smartPreviewParams<TItem>) => {
  if (!dequal(state.context.preview, preview) && !isTouchDevice()) {
    setContext({ preview });

    refresh();
    setActiveItemId(state.activeItemId);
    updateActiveItem(state.activeItemId);
  }
};
