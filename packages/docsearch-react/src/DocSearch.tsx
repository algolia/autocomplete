import React from 'react';
import { createPortal } from 'react-dom';
import {
  PublicAutocompleteOptions,
  AutocompleteState,
} from '@francoischalifour/autocomplete-core';

import { DocSearchHit, InternalDocSearchHit, SearchClient } from './types';
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
  transformSearchClient?(searchClient: SearchClient): SearchClient;
  disableUserPersonalization?: boolean;
  initialQuery?: string;
}

export function DocSearch(props: DocSearchProps) {
  const searchButtonRef = React.useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [initialQuery, setInitialQuery] = React.useState(undefined);

  const onOpen = React.useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const onClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const onInput = React.useCallback(
    (event) => {
      setIsOpen(true);
      setInitialQuery(event.key);
    },
    [setIsOpen, setInitialQuery]
  );

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
    onInput,
    searchButtonRef,
  });

  return (
    <>
      <DocSearchButton onClick={onOpen} ref={searchButtonRef} />

      {isOpen &&
        createPortal(
          <DocSearchModal
            {...props}
            initialScrollY={window.scrollY}
            initialQuery={initialQuery}
            onClose={onClose}
          />,
          document.body
        )}
    </>
  );
}
