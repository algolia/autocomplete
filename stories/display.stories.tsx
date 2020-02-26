/** @jsx h */

import { h, render } from 'preact';
import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import { storiesOf } from '@storybook/html';
import algoliasearch from 'algoliasearch/lite';

import { withPlayground } from '../.storybook/decorators';
import { Autocomplete } from '@francoischalifour/autocomplete-react';
import { getAlgoliaHits } from '@francoischalifour/autocomplete-preset-algolia';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

function Component(props) {
  return (
    <Autocomplete
      {...props}
      getSources={() => {
        return [
          {
            getInputValue({ suggestion }) {
              return suggestion.query;
            },
            getSuggestions({ query }) {
              return getAlgoliaHits({
                searchClient,
                queries: [
                  {
                    indexName: 'instant_search_demo_query_suggestions',
                    query,
                    params: {
                      hitsPerPage: 4,
                    },
                  },
                ],
              });
            },
          },
        ];
      }}
    />
  );
}

storiesOf('Display', module)
  .add(
    'Heading search bar',
    withPlayground(({ container, dropdownContainer }) => {
      render(<Component dropdownContainer={dropdownContainer} />, container);

      return container;
    })
  )
  .add(
    'Left search bar',
    withPlayground(
      ({ container, dropdownContainer }) => {
        render(
          <Component
            dropdownContainer={dropdownContainer}
            dropdownPlacement="start"
          />,
          container
        );

        return container;
      },
      {
        searchBoxPosition: 'start',
      }
    )
  )
  .add(
    'Right search bar',
    withPlayground(
      ({ container, dropdownContainer }) => {
        render(
          <Component
            dropdownContainer={dropdownContainer}
            dropdownPlacement="end"
          />,
          container
        );

        return container;
      },
      {
        searchBoxPosition: 'end',
      }
    )
  )
  .add(
    'Modal',
    withPlayground(
      ({ container, dropdownContainer }) => {
        function App() {
          const modalRef = useRef(null);
          const inputRef = useRef(null);
          const [isShowing, setIsShowing] = useState(false);

          const toggleModal = useCallback(() => {
            if (isShowing) {
              setIsShowing(false);
              return;
            }

            setIsShowing(true);
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }, 0);
          }, [isShowing, setIsShowing]);

          useEffect(() => {
            function onKeyDown(event: KeyboardEvent) {
              if (
                (event.key === 'Escape' && isShowing) ||
                (event.key === 'k' && (event.metaKey || event.ctrlKey))
              ) {
                event.preventDefault();
                toggleModal();
              }
            }

            window.addEventListener('keydown', onKeyDown);

            return () => {
              window.removeEventListener('keydown', onKeyDown);
            };
          }, [toggleModal, isShowing]);

          return (
            <div>
              <button
                style={{
                  cursor: 'pointer',
                  background: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  fontSize: 'inherit',
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: 180,
                }}
                onClick={toggleModal}
              >
                <div>
                  <svg
                    height="16"
                    viewBox="0 0 16 16"
                    width="16"
                    style={{ marginRight: 12, height: 12, width: 12 }}
                  >
                    <path
                      d="M12.6 11.2c.037.028.073.059.107.093l3 3a1 1 0 1 1-1.414 1.414l-3-3a1.009 1.009 0 0 1-.093-.107 7 7 0 1 1 1.4-1.4zM7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10z"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                  Search
                </div>

                <kbd
                  style={{
                    border: '1px solid #ddd',
                    padding: '2px 4px',
                    borderRadius: 3,
                    background: '#f9f8f8',
                  }}
                >
                  Cmd+K
                </kbd>
              </button>

              {isShowing &&
                createPortal(
                  <div
                    ref={modalRef}
                    onClick={event => {
                      if (event.target === modalRef.current) {
                        setIsShowing(false);
                      }
                    }}
                    style={{
                      display: 'flex',
                      paddingTop: 120,
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0, 0, 0, .24)',
                      bottom: 0,
                      left: 0,
                      overflowY: 'auto',
                      position: 'fixed',
                      top: 0,
                      right: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 480,
                        maxWidth: 'calc(100vw - 32px)',
                        height: 0,
                      }}
                    >
                      <Autocomplete
                        openOnFocus={true}
                        placeholder="Search..."
                        defaultHighlightedIndex={0}
                        inputRef={inputRef}
                        getSources={({ query }) => {
                          if (!query) {
                            return [
                              {
                                getInputValue({ suggestion }) {
                                  return suggestion.query;
                                },
                                getSuggestions() {
                                  return [
                                    {
                                      query: 'GitHub',
                                      _highlightResult: {
                                        query: { value: 'GitHub' },
                                      },
                                    },
                                    {
                                      query: 'Twitter',
                                      _highlightResult: {
                                        query: { value: 'Twitter' },
                                      },
                                    },
                                  ];
                                },
                              },
                            ];
                          }

                          return [
                            {
                              getInputValue({ suggestion }) {
                                return suggestion.query;
                              },
                              getSuggestions({ query }) {
                                return getAlgoliaHits({
                                  searchClient,
                                  queries: [
                                    {
                                      indexName:
                                        'instant_search_demo_query_suggestions',
                                      query,
                                      params: {
                                        hitsPerPage: 4,
                                      },
                                    },
                                  ],
                                });
                              },
                            },
                          ];
                        }}
                      />
                    </div>
                  </div>,
                  dropdownContainer
                )}
            </div>
          );
        }

        render(<App />, container);

        return container;
      },
      {
        searchBoxPosition: 'end',
      }
    )
  );
