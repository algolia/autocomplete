/** @jsx createElement */
import { BaseItem, PluginSubscribeParams } from '@algolia/autocomplete-core';
import {
  AutocompletePlugin,
  AutocompleteSource,
  AutocompleteState,
} from '@algolia/autocomplete-js';
import { noop } from '@algolia/autocomplete-shared';

import { createTags, OnTagsChangeParams } from './createTags';
import type { DefaultTagType, BaseTag, Tag } from './types';

type OnChangeParams<TTag extends DefaultTagType = DefaultTagType> =
  PluginSubscribeParams<any> & OnTagsChangeParams<TTag>;

type GetTagParams<TItem extends BaseItem> = { item: TItem };

type TagsPluginData<TTag extends DefaultTagType = DefaultTagType> = {
  /**
   * Returns the current list of tags.
   *
   * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-tags/createtagsplugin/#param-tags
   */
  tags: Array<Tag<TTag>>;
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

export type TagsApi<TTag extends DefaultTagType = DefaultTagType> =
  TagsPluginData<TTag>;

export type CreateTagsPluginParams<
  TItem extends BaseItem,
  TTag extends DefaultTagType
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
    getTag(params: GetTagParams<TItem>): BaseTag<TTag>;
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

export function createTagsPlugin<
  TItem extends BaseItem,
  TTag extends DefaultTagType = DefaultTagType
>(
  options: CreateTagsPluginParams<TItem, TTag> = {}
): AutocompletePlugin<Tag<TTag>, TagsPluginData<TTag>> {
  const { initialTags, getTagsSubscribers, transformSource, onChange } =
    getOptions(options);
  const tags = createTags({ initialTags });
  const tagsApi = { setTags: tags.set, addTags: tags.add };

  return {
    name: 'aa.tagsPlugin',
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
                  <div className="aa-TagsPlugin-Tag">
                    <span className="aa-TagsPlugin-TagLabel">{item.label}</span>
                    <button
                      className="aa-TagsPlugin-RemoveButton"
                      title="Remove this tag"
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path d="M18 6L6 18"></path>
                        <path d="M6 6L18 18"></path>
                      </svg>
                    </button>
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
    __autocomplete_pluginOptions: options,
  };
}

function getOptions<
  TItem extends BaseItem,
  TTag extends DefaultTagType = DefaultTagType
>(options: CreateTagsPluginParams<TItem, TTag>) {
  return {
    initialTags: [],
    getTagsSubscribers: () => [],
    transformSource: ({ source }) => source,
    onChange: noop,
    ...options,
  };
}
