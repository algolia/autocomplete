import React from 'react';
import {
  AutocompleteState,
  GetMenuProps,
  GetItemProps,
} from '@francoischalifour/autocomplete-core';

import { InternalDocSearchHit } from '../types';
import { Error } from '../Error';
import { NoResults } from '../NoResults';
import { Results } from '../Results';

interface DropdownProps {
  state: AutocompleteState<InternalDocSearchHit>;
  getMenuProps: GetMenuProps;
  getItemProps: GetItemProps<InternalDocSearchHit, React.MouseEvent>;
}

export function Dropdown(props: DropdownProps) {
  if (props.state.status === 'error') {
    return <Error />;
  }

  if (
    props.state.status === 'idle' &&
    props.state.suggestions.every(source => source.items.length === 0)
  ) {
    return <NoResults query={props.state.query} />;
  }

  return (
    <Results
      suggestions={props.state.suggestions}
      getMenuProps={props.getMenuProps}
      getItemProps={props.getItemProps}
    />
  );
}
