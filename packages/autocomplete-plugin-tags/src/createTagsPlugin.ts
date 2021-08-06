import { BaseItem, PluginSubscribeParams } from '@algolia/autocomplete-core';
import {
  AutocompletePlugin,
  AutocompleteSource,
  AutocompleteState,
} from '@algolia/autocomplete-js';

import { createTags, OnTagsChangeParams } from './createTags';
import { getTemplates } from './getTemplates';
import type { BaseTag, Tag } from './types';

type OnChangeParams<TTag> = PluginSubscribeParams<any> & OnTagsChangeParams<TTag>;

type TagsPluginData<TTag> = {
  readonly tags: Array<Tag<TTag>>;
  setTags: (tags: Array<BaseTag<TTag>>) => void;
  addTags: (tags: Array<BaseTag<TTag>>) => void;
};

export type CreateTagsPluginParams<TTag extends Record<string, any>, TItem extends BaseItem> = {
  initialTags?: Array<BaseTag<TTag>>;
  getTagsSubscribers?(): Array<{
    sourceId: string;
    getTag(params: { item: TItem }): BaseTag<TTag>;
  }>;
  transformSource?(params: {
    source: AutocompleteSource<Tag<TTag>>;
    state: AutocompleteState<Tag<TTag>>;
  }): AutocompleteSource<Tag<TTag>> | null;
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
            templates: getTemplates(),
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
