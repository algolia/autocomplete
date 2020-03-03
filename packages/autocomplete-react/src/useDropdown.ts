import { useRef, useLayoutEffect, MutableRefObject } from 'react';
import { createPopper } from '@popperjs/core/lib/popper-lite';

import { AutocompleteState } from '@francoischalifour/autocomplete-core';
import { RendererProps } from './Autocomplete';

export function useDropdown<TItem>(
  props: RendererProps,
  state: AutocompleteState<TItem>,
  searchBoxRef: MutableRefObject<HTMLFormElement | null>,
  dropdownRef: MutableRefObject<HTMLDivElement | null>
) {
  const popper = useRef<ReturnType<typeof createPopper> | null>(null);

  useLayoutEffect(() => {
    if (searchBoxRef.current && dropdownRef.current) {
      popper.current = createPopper(searchBoxRef.current, dropdownRef.current, {
        placement:
          props.dropdownPlacement === 'end' ? 'bottom-end' : 'bottom-start',
        modifiers: [
          // By default, Popper overrides the `margin` style to `0` because it
          // is known to cause issues when computing the position.
          // We consider this as a problem in Autocomplete because it prevents
          // users from setting different desktop/mobile styles in CSS.
          // If we leave Popper override `margin`, users would have to use the
          // `!important` CSS keyword or we would have to expose a JavaScript
          // API.
          // See https://github.com/francoischalifour/autocomplete.js/pull/25
          {
            name: 'unsetMargins',
            enabled: true,
            fn: ({ state }) => {
              state.styles.popper.margin = '';
            },
            requires: ['computeStyles'],
            phase: 'beforeWrite',
          },
        ],
      });
    }

    return () => {
      popper.current?.destroy();
    };
  }, [searchBoxRef, dropdownRef, props.dropdownPlacement]);

  useLayoutEffect(() => {
    if (state.isOpen) {
      popper.current?.update();
    }
  }, [state.isOpen]);
}
