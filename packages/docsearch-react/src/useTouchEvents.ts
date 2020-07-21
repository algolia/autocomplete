import { AutocompleteApi } from '@francoischalifour/autocomplete-core';
import React from 'react';

interface UseTouchEventsProps {
  getEnvironmentProps: AutocompleteApi<any>['getEnvironmentProps'];
  dropdownElement: HTMLDivElement | null;
  searchBoxElement: HTMLDivElement | null;
  inputElement: HTMLInputElement | null;
}

export function useTouchEvents({
  getEnvironmentProps,
  dropdownElement,
  searchBoxElement,
  inputElement,
}: UseTouchEventsProps) {
  React.useEffect(() => {
    if (!(dropdownElement && searchBoxElement && inputElement)) {
      return undefined;
    }

    const { onTouchStart, onTouchMove } = getEnvironmentProps({
      dropdownElement,
      searchBoxElement,
      inputElement,
    });

    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [getEnvironmentProps, dropdownElement, searchBoxElement, inputElement]);
}
