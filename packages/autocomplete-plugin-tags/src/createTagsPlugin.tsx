/** @jsx createElement */
import { BaseItem, PluginSubscribeParams } from '@algolia/autocomplete-core';
import {
  AutocompletePlugin,
  AutocompleteSource,
  AutocompleteState,
} from '@algolia/autocomplete-js';

import { createTags, OnTagsChangeParams } from './createTags';
import type { BaseTag, Tag } from './types';

type OnChangeParams<TTag> = PluginSubscribeParams<any> &
  OnTagsChangeParams<TTag>;

type TagsPluginData<TTag> = {
  /**
   * Returns the current list of tags.
   *
   * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-tags/createtagsplugin/#param-tags
   */
  readonly tags: Array<Tag<TTag>>;
  /**
   * Adds tags to the list.
   *
   * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-tags/createtagsplugin/#param-addtags
   */
  addTags: (tags: Array<BaseTag<TTag>>) => void;
  /**
   * Sets the list of tags.
   *
   * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-tags/createtagsplugin/#param-settags
   */
  setTags: (tags: Array<BaseTag<TTag>>) => void;
};

export type CreateTagsPluginParams<
  TTag extends Record<string, any>,
  TItem extends BaseItem
> = {
  /**
   * A set of initial tags to pass to the plugin.
   *
   * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-tags/createtagsplugin/#param-initialtags
   */
  initialTags?: Array<BaseTag<TTag>>;
  /**
   * A function to specify what sources the plugin should subscribe to. The plugin adds a tag when selecting an item from these sources.
   *
   * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-tags/createtagsplugin/#param-gettagssubscribers
   */
  getTagsSubscribers?(): Array<{
    sourceId: string;
    getTag(params: { item: TItem }): BaseTag<TTag>;
  }>;
  /**
   * A function to transform the returned tags source.
   *
   * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-tags/createtagsplugin/#param-transformsource
   */
  transformSource?(params: {
    source: AutocompleteSource<Tag<TTag>>;
    state: AutocompleteState<Tag<TTag>>;
  }): AutocompleteSource<Tag<TTag>> | undefined;
  /**
   * A function called when the list of tags changes.
   *
   * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-tags/createtagsplugin/#param-onchange
   */
  onChange?(params: OnChangeParams<TTag>): void;
};

export function createTagsPlugin<TTag, TItem extends BaseItem>({
  initialTags = [],
  getTagsSubscribers = () => [],
  transformSource = ({ source }) => source,
  onChange = () => {},
}: CreateTagsPluginParams<TTag, TItem>): AutocompletePlugin<
  Tag<TTag>,
  TagsPluginData<TTag>
> {
  const tags = createTags({ initialTags });
  const tagsApi = { setTags: tags.set, addTags: tags.add };

  return {
    subscribe(params) {
      const { setContext, onSelect, setIsOpen, refresh } = params;
      const subscribers = getTagsSubscribers();

      setContext({ tagsPlugin: { ...tagsApi, tags: tags.get() } });

      onSelect(({ source, item }) => {
        const subscriber = subscribers.find(
          ({ sourceId }) => sourceId === source.sourceId
        );

        if (subscriber) {
          tags.add([subscriber.getTag({ item })]);
        }
      });

      tags.onChange(({ prevTags }) => {
        setContext({
          tagsPlugin: { ...tagsApi, tags: tags.get() },
        });

        setIsOpen(true);
        onChange({ ...params, prevTags, tags: tags.get() });
        refresh();
      });
    },
    getSources({ state }) {
      return [
        transformSource({
          source: {
            sourceId: 'tagsPlugin',
            getItems() {
              return tags.get();
            },
            onSelect({ item }) {
              item.remove();
            },
            templates: {
              item({ item, createElement }) {
                return (
                  <div className="aa-ItemWrapper">
                    <div className="aa-ItemContent">
                      <div className="aa-ItemIcon aa-ItemIcon--noBorder">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01" />
                        </svg>
                      </div>
                      <div className="aa-ItemContentBody">
                        <div className="aa-ItemContentTitle">
                          <span className="aa-ItemContentLabel">
                            {item.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="aa-ItemActions">
                      <button
                        className="aa-ItemActionButton"
                        title="Remove this tag"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18 7v13c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-10c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-13zM17 5v-1c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-4c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1h1v13c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h10c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-13h1c0.552 0 1-0.448 1-1s-0.448-1-1-1zM9 5v-1c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h4c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v1zM9 11v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1zM13 11v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              },
            },
          },
          state: state as AutocompleteState<Tag<TTag>>,
        }),
      ];
    },
    data: {
      ...tagsApi,
      get tags() {
        return tags.get();
      },
    },
  };
}
