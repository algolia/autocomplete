import {
  AutocompleteOptions,
  AutocompleteState,
  createAutocomplete,
} from '@algolia/autocomplete-core';
import { getAlgoliaHits } from '@algolia/autocomplete-preset-algolia';
import algoliasearch from 'algoliasearch/lite';
import React from 'react';

import { ResetIcon } from './ResetIcon';
import { SearchIcon } from './SearchIcon';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

type AutocompleteItem = {
  objectID: string;
  query: string;
  _highlightResult: {
    query: {
      value: string;
    };
  };
};

export function Autocomplete(
  props: Partial<AutocompleteOptions<AutocompleteItem>>
) {
  const [autocompleteState, setAutocompleteState] = React.useState<
    AutocompleteState<AutocompleteItem>
  >({
    collections: [],
    completion: null,
    context: {},
    isOpen: false,
    query: '',
    activeItemId: null,
    status: 'idle',
  });
  const autocomplete = React.useMemo(
    () =>
      createAutocomplete<
        AutocompleteItem,
        React.BaseSyntheticEvent,
        React.MouseEvent,
        React.KeyboardEvent
      >({
        onStateChange({ state }) {
          setAutocompleteState(state);
        },
        getSources() {
          return [
            {
              getItemInputValue({ item }) {
                return item.query;
              },
              getItems({ query }) {
                return getAlgoliaHits({
                  searchClient,
                  queries: [
                    {
                      indexName: 'instant_search_demo_query_suggestions',
                      query,
                      params: {
                        hitsPerPage: 5,
                        highlightPreTag: '<mark>',
                        highlightPostTag: '</mark>',
                      },
                    },
                  ],
                });
              },
            },
          ];
        },
        ...props,
      }),
    [props]
  );
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const { getEnvironmentProps } = autocomplete;

  React.useEffect(() => {
    if (!formRef.current || !panelRef.current || !inputRef.current) {
      return undefined;
    }

    const { onTouchStart, onTouchMove } = getEnvironmentProps({
      formElement: formRef.current,
      inputElement: inputRef.current,
      panelElement: panelRef.current,
    });

    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [getEnvironmentProps, formRef, inputRef, panelRef]);

  return (
    <div className="aa-Autocomplete" {...autocomplete.getRootProps({})}>
      <form
        ref={formRef}
        className="aa-Form"
        {...autocomplete.getFormProps({ inputElement: inputRef.current })}
      >
        <div className="aa-InputWrapper">
          <label className="aa-Label" {...autocomplete.getLabelProps({})}>
            <SearchIcon />
          </label>
          <input
            className="aa-Input"
            ref={inputRef}
            {...autocomplete.getInputProps({ inputElement: inputRef.current })}
          />
          <button className="aa-ResetButton" type="reset">
            <ResetIcon />
          </button>
        </div>
      </form>

      {autocompleteState.isOpen && (
        <div
          ref={panelRef}
          className={[
            'aa-Panel',
            autocompleteState.status === 'stalled' && 'aa-Panel--stalled',
          ]
            .filter(Boolean)
            .join(' ')}
          {...autocomplete.getPanelProps({})}
        >
          <div className="aa-PanelLayout">
            {autocompleteState.collections.map((collection, index) => {
              const { source, items } = collection;

              return (
                <section key={`source-${index}`} className="aa-Source">
                  {items.length > 0 && (
                    <ul className="aa-List" {...autocomplete.getListProps()}>
                      {items.map((item) => {
                        return (
                          <li
                            key={item.objectID}
                            className="aa-Item"
                            {...autocomplete.getItemProps({ item, source })}
                          >
                            <div className="aa-ItemContent">
                              <SearchIcon className="aa-ItemSourceIcon" />
                              <div
                                className="aa-ItemTitle"
                                dangerouslySetInnerHTML={{
                                  __html: item._highlightResult.query.value,
                                }}
                              />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
