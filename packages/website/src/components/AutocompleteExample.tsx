import { autocomplete, AutocompleteOptions } from '@algolia/autocomplete-js';
import React, { useEffect, useRef } from 'react';

import '@algolia/autocomplete-theme-classic';

export function AutocompleteExample<TItem extends {}>(
  props: Omit<AutocompleteOptions<TItem>, 'container'>
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    autocomplete({
      container: containerRef.current,
      ...props,
    });
  }, [props]);

  return <div ref={containerRef} style={{ padding: '1rem 0' }} />;
}
