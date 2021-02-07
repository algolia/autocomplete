import { autocomplete, AutocompleteOptions } from '@algolia/autocomplete-js';
import React, { createElement, Fragment, useEffect, useRef } from 'react';
import { render } from 'react-dom';

export function AutocompleteExample<TItem extends {}>(
  props: Omit<AutocompleteOptions<TItem>, 'container'>
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const search = autocomplete({
      container: containerRef.current,
      debug: process.env.NODE_ENV === 'development',
      placeholder: 'Search',
      renderer: { createElement, Fragment },
      render({ children }, root) {
        render(children as any, root);
      },
      ...props,
    });

    return () => {
      search.destroy();
    };
  }, [props]);

  return <div ref={containerRef} style={{ padding: '1rem 0' }} />;
}
