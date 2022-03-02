import { BaseItem, OnActiveParams } from '@algolia/autocomplete-core';
import { dequal } from 'dequal/lite';

type smartPreviewParams<TItem extends BaseItem> = OnActiveParams<TItem> & {
  contextData: {
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

export const smartPreview = <TItem extends BaseItem>({
  state,
  setContext,
  refresh,
  contextData,
  setActiveItemId,
}: smartPreviewParams<TItem>) => {
  if (!dequal(state.context.preview, contextData)) {
    setContext({
      preview: contextData,
    });
    refresh();
    setActiveItemId(state.activeItemId);
    updateActiveItem(state.activeItemId);
  }
};
