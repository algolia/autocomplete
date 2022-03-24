import {
  AutocompleteScopeApi,
  AutocompleteState,
  BaseItem,
} from '@algolia/autocomplete-core';
import { dequal } from 'dequal/lite';

import { isTouchDevice } from './utils';

type smartPreviewParams<
  TItem extends BaseItem
> = AutocompleteScopeApi<TItem> & {
  state: AutocompleteState<TItem>;
  preview: {
    [key: string]: unknown;
  };
};

export function setSmartPreview<TItem extends BaseItem>({
  state,
  setContext,
  refresh,
  preview,
}: smartPreviewParams<TItem>) {
  if (!dequal(state.context.preview, preview) && !isTouchDevice()) {
    setContext({ preview, lastActiveItemId: state.activeItemId });
    refresh();
  }
}
