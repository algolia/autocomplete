import {
  AutocompleteOptions,
  AutocompleteState,
  createAutocomplete,
} from '@algolia/autocomplete-core';
import { getAlgoliaHits } from '@algolia/autocomplete-preset-algolia';
import { Hit } from '@algolia/client-search';
import algoliasearch from 'algoliasearch/lite';
import React from 'react';

import { ClearIcon } from './ClearIcon';
import { SearchIcon } from './SearchIcon';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

type AutocompleteItem = Hit<{
  objectID: string;
  name: string;
  description: string;
  image: string;
  url: string;
}>;

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
              sourceId: 'products',
              getItems({ query }) {
                return getAlgoliaHits({
                  searchClient,
                  queries: [
                    {
                      indexName: 'instant_search',
                      query,
                      params: {
                        hitsPerPage: 5,
                        highlightPreTag: '<mark>',
                        highlightPostTag: '</mark>',
                        attributesToSnippet: ['name:10', 'description:35'],
                        snippetEllipsisText: '…',
                      },
                    },
                  ],
                });
              },
              getItemUrl({ item }) {
                return item.url;
              },
            },
          ];
        },
        ...props,
      }),
    [props]
  );
  const inputRef = React.useRef<HTMLInputElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
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
        <div className="aa-InputWrapperPrefix">
          <label className="aa-Label" {...autocomplete.getLabelProps({})}>
            <SearchIcon />
          </label>
        </div>
        <div className="aa-InputWrapper">
          <input
            className="aa-Input"
            ref={inputRef}
            {...autocomplete.getInputProps({ inputElement: inputRef.current })}
          />
        </div>
        <div className="aa-InputWrapperSuffix">
          <button className="aa-ClearButton" title="Clear" type="reset">
            <ClearIcon />
          </button>
        </div>
      </form>

      {autocompleteState.isOpen && (
        <div
          ref={panelRef}
          className={[
            'aa-Panel',
            'aa-Panel--desktop',
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
                            <div className="aa-ItemWrapper">
                              <div className="aa-ItemIcon">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  width="40"
                                  height="40"
                                />
                              </div>
                              <div className="aa-ItemContent">
                                <div className="aa-ItemContentBody">
                                  <div
                                    className="aa-ItemContentTitle"
                                    dangerouslySetInnerHTML={{
                                      __html: item._snippetResult!.name.value,
                                    }}
                                  />
                                  <div
                                    className="aa-ItemContentDescription"
                                    dangerouslySetInnerHTML={{
                                      __html: item._snippetResult!.description
                                        .value,
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="aa-ItemActions">
                                <button
                                  className="aa-ItemActionButton aa-DesktopOnly aa-ActiveOnly"
                                  type="button"
                                  title="Select"
                                >
                                  <svg
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    width="20"
                                    height="20"
                                  >
                                    <path d="M18.984 6.984h2.016v6h-15.188l3.609 3.609-1.406 1.406-6-6 6-6 1.406 1.406-3.609 3.609h13.172v-4.031z" />
                                  </svg>
                                </button>
                              </div>
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
