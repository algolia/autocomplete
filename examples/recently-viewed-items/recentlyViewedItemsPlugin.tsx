/** @jsxRuntime classic */
/** @jsx h */
import {
  AutocompletePlugin,
  AutocompleteSource,
  AutocompleteState,
} from '@algolia/autocomplete-js';
import {
  createLocalStorageRecentSearchesPlugin,
  search,
  SearchParams,
} from '@algolia/autocomplete-plugin-recent-searches';
import { MaybePromise } from '@algolia/autocomplete-shared';
import { h, Fragment } from 'preact';

import { Highlighted } from './types';

type RecentlyViewedRecord = {
  id: string;
  label: string;
  url: string;
  image: string;
};

type CreateLocalStorageRecentlyViewedItemsParams<
  TItem extends RecentlyViewedRecord
> = {
  key: string;
  limit?: number;
  search?(params: SearchParams<TItem>): Array<Highlighted<TItem>>;
  transformSource?(params: {
    source: AutocompleteSource<TItem>;
    state: AutocompleteState<TItem>;
    onRemove(id: string): void;
  }): AutocompleteSource<TItem>;
};

type RecentlyViewedItemsPluginData<TItem extends RecentlyViewedRecord> = {
  addItem(item: TItem): void;
  removeItem(id: string): void;
  getAll(query?: string): MaybePromise<Array<Highlighted<TItem>>>;
};

export function createLocalStorageRecentlyViewedItems<
  TItem extends RecentlyViewedRecord
>(
  params: CreateLocalStorageRecentlyViewedItemsParams<TItem>
): AutocompletePlugin<TItem, RecentlyViewedItemsPluginData<TItem>> {
  const { onReset, onSubmit, subscribe, ...plugin } =
    createLocalStorageRecentSearchesPlugin<TItem>({
      ...params,
      search(params) {
        if (params.query) {
          return [];
        }

        return search(params);
      },
      transformSource({ source, onRemove, state }) {
        const transformedSource = params.transformSource
          ? params.transformSource({ source, onRemove, state })
          : source;

        return {
          ...transformedSource,
          sourceId: 'recentlyViewedItemsPlugin',
          getItemUrl({ item }) {
            return item.url;
          },
          templates: {
            ...transformedSource.templates,
            header() {
              return (
                <Fragment>
                  <span className="aa-SourceHeaderTitle">Recently viewed</span>
                  <div className="aa-SourceHeaderLine" />
                </Fragment>
              );
            },
            item({ item, components }) {
              return (
                <a className="aa-ItemLink" href={item.url}>
                  <div className="aa-ItemContent">
                    {item.image ? (
                      <div className="aa-ItemIcon">
                        <img src={item.image} alt={item.label} />
                      </div>
                    ) : (
                      <div className="aa-ItemIcon aa-ItemIcon--noBorder">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.516 6.984v5.25l4.5 2.672-0.75 1.266-5.25-3.188v-6h1.5zM12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93z" />
                        </svg>
                      </div>
                    )}
                    <div className="aa-ItemContentBody">
                      <div className="aa-ItemContentTitle">
                        <components.Highlight hit={item} attribute="label" />
                      </div>
                    </div>
                  </div>
                  <div className="aa-ItemActions">
                    <button
                      className="aa-ItemActionButton"
                      title="Remove this search"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onRemove(item.id);
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="currentColor"
                      >
                        <path d="M18 7v13c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-10c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-13zM17 5v-1c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-4c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1h1v13c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h10c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-13h1c0.552 0 1-0.448 1-1s-0.448-1-1-1zM9 5v-1c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h4c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v1zM9 11v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1zM13 11v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1z" />
                      </svg>
                    </button>
                  </div>
                </a>
              );
            },
          },
        };
      },
    });
  const { getAlgoliaSearchParams, ...data } = plugin.data;

  return {
    ...plugin,
    name: 'aa.localStorageRecentlyViewedItemsPlugin',
    data,
  };
}
