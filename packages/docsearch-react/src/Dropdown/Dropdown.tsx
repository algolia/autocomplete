import React from 'react';
import {
  AutocompleteApi,
  AutocompleteState,
} from '@francoischalifour/autocomplete-core';

import { InternalDocSearchHit, RecentDocSearchHit } from '../types';
import { EmptyScreen } from '../EmptyScreen';
import { Results } from '../Results';
import { NoResults } from '../NoResults';
import { Error } from '../Error';

interface DropdownProps<TItem>
  extends AutocompleteApi<
    TItem,
    React.FormEvent,
    React.MouseEvent,
    React.KeyboardEvent
  > {
  state: AutocompleteState<TItem>;
  onItemClick(search: RecentDocSearchHit): void;
  onAction(search: RecentDocSearchHit): void;
  inputRef: React.MutableRefObject<null | HTMLInputElement>;
}

export function Dropdown(props: DropdownProps<InternalDocSearchHit>) {
  if (props.state.status === 'error') {
    return <Error />;
  }

  const hasSuggestions = props.state.suggestions.some(
    source => source.items.length > 0
  );

  if (!props.state.query) {
    return (
      <EmptyScreen
        {...(props as DropdownProps<any>)}
        hasSuggestions={hasSuggestions}
      />
    );
  }

  if (props.state.status === 'idle' && hasSuggestions === false) {
    return <NoResults {...props} />;
  }

  return <Results {...props} />;
}
