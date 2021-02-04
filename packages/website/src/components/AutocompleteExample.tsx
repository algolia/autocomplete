import { autocomplete, AutocompleteOptions } from '@algolia/autocomplete-js';
import React, { createElement, Fragment, useEffect, useRef } from 'react';
import { render } from 'react-dom';

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
      renderer: { createElement, Fragment },
      render({ children }, root) {
        render(children as any, root);
      },
      ...props,
    });
  }, [props]);

  return <div ref={containerRef} style={{ padding: '1rem 0' }} />;
}
