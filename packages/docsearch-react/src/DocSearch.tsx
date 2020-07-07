import React from 'react';
import { createPortal } from 'react-dom';
import {
  PublicAutocompleteOptions,
  AutocompleteState,
} from '@francoischalifour/autocomplete-core';

import { DocSearchHit, InternalDocSearchHit } from './types';
import { DocSearchButton } from './DocSearchButton';
import { DocSearchModal } from './DocSearchModal';
import { useDocSearchKeyboardEvents } from './useDocSearchKeyboardEvents';

export interface DocSearchProps
  extends Pick<PublicAutocompleteOptions<InternalDocSearchHit>, 'navigator'> {
  appId?: string;
  apiKey: string;
  indexName: string;
  placeholder?: string;
  searchParameters?: any;
  transformItems?(items: DocSearchHit[]): DocSearchHit[];
  hitComponent?(props: {
    hit: DocSearchHit;
    children: React.ReactNode;
  }): JSX.Element;
  resultsFooterComponent?(props: {
    state: AutocompleteState<InternalDocSearchHit>;
  }): JSX.Element | null;
}

export function DocSearch(props: DocSearchProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const searchButtonRef = React.useRef<HTMLButtonElement>(null);

  const onOpen = React.useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const onClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  useDocSearchKeyboardEvents({ isOpen, onOpen, onClose, searchButtonRef });

  return (
    <>
      <DocSearchButton onClick={onOpen} ref={searchButtonRef} />

      {isOpen &&
        createPortal(
          <DocSearchModal
            {...props}
            initialScrollY={window.scrollY}
            onClose={onClose}
          />,
          document.body
        )}
    </>
  );
}
