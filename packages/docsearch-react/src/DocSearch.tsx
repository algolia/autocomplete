import React from 'react';
import { createPortal } from 'react-dom';
import { PublicAutocompleteOptions } from '@francoischalifour/autocomplete-core';

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
}

export function DocSearch(props: DocSearchProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const onOpen = React.useCallback(
    function onOpen() {
      setIsOpen(true);
    },
    [setIsOpen]
  );

  const onClose = React.useCallback(
    function onClose() {
      setIsOpen(false);
    },
    [setIsOpen]
  );

  useDocSearchKeyboardEvents({ isOpen, onOpen, onClose });

  return (
    <>
      <DocSearchButton onClick={onOpen} />

      {isOpen &&
        createPortal(
          <DocSearchModal {...props} onClose={onClose} />,
          document.body
        )}
    </>
  );
}
