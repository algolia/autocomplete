import { BaseItem } from '@algolia/autocomplete-core';
import { createRef } from '@algolia/autocomplete-shared';

import { CreateTagsPluginParams } from './createTagsPlugin';
import { DefaultTagType, BaseTag, Tag } from './types';

export type OnTagsChangeParams<TTag = DefaultTagType> = {
  prevTags: Array<Tag<TTag>>;
  tags: Array<Tag<TTag>>;
};

type OnTagsChangeListener<TTag = DefaultTagType> = (
  params: OnTagsChangeParams<TTag>
) => void;

type CreateTagsParams<TItem extends BaseItem, TTag = DefaultTagType> = Pick<
  CreateTagsPluginParams<TItem, TTag>,
  'initialTags'
>;

export function createTags<TTag, TItem extends BaseItem>({
  initialTags = [],
}: CreateTagsParams<TItem, TTag>) {
  const tagsRef = createRef(mapToTags(initialTags));
  const onChangeListeners: Array<OnTagsChangeListener<TTag>> = [];

  function mapToTags<TTag>(baseTags: Array<BaseTag<TTag>>): Array<Tag<TTag>> {
    return baseTags.map((baseTag) => {
      const tag = {
        ...baseTag,
        remove() {
          const prevTags = tagsRef.current.slice();

          tagsRef.current = tagsRef.current.filter(
            (tagRef) => tag !== ((tagRef as unknown) as Tag<TTag>)
          );
          onChangeListeners.forEach((listener) =>
            listener({ prevTags, tags: tagsRef.current })
          );
        },
      };

      return tag;
    });
  }

  return {
    get() {
      return tagsRef.current;
    },
    set(baseTags: Array<BaseTag<TTag>>) {
      const prevTags = tagsRef.current.slice();

      tagsRef.current = mapToTags(baseTags);
      onChangeListeners.forEach((listener) =>
        listener({ prevTags, tags: tagsRef.current })
      );
    },
    add(baseTags: Array<BaseTag<TTag>>) {
      const prevTags = tagsRef.current.slice();

      tagsRef.current.push(...mapToTags(baseTags));
      onChangeListeners.forEach((listener) =>
        listener({ prevTags, tags: tagsRef.current })
      );
    },
    onChange(listener: OnTagsChangeListener<TTag>) {
      onChangeListeners.push(listener);
    },
  };
}
