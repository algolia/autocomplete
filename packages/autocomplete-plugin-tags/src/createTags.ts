import { createRef } from '@algolia/autocomplete-shared';

import { CreateTagsPluginParams } from './createTagsPlugin';
import { BaseTag, Tag } from './types';

export type OnTagsChangeParams<TTag> = {
  prevTags: Array<Tag<TTag>>;
  tags: Array<Tag<TTag>>;
};

type OnTagsChangeListener<TTag> = (params: OnTagsChangeParams<TTag>) => void;

type CreateTagsParams<TTag> = Pick<CreateTagsPluginParams<TTag>, 'initialTags'>;

export function createTags<TTag>({ initialTags = [] }: CreateTagsParams<TTag>) {
  const tagsRef = createRef(toTags(initialTags));
  const onChangeListeners: Array<OnTagsChangeListener<TTag>> = [];

  function toTags<TTag>(baseTags: Array<BaseTag<TTag>>): Array<Tag<TTag>> {
    return baseTags.map((baseTag) => {
      const tag = {
        ...baseTag,
        remove() {
          const prevTags = tagsRef.current.slice();
          const newTags = tagsRef.current.filter(
            (tagRef) => tag !== ((tagRef as unknown) as Tag<TTag>)
          );

          tagsRef.current = newTags;
          onChangeListeners.forEach((listener) =>
            listener({ prevTags, tags: newTags })
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
      const newTags = toTags(baseTags);

      tagsRef.current = newTags;
      onChangeListeners.forEach((listener) =>
        listener({ prevTags, tags: tagsRef.current })
      );
    },
    add(baseTags: Array<BaseTag<TTag>>) {
      const prevTags = tagsRef.current.slice();
      const newTags = toTags(baseTags);

      tagsRef.current.push(...newTags);
      onChangeListeners.forEach((listener) =>
        listener({ prevTags, tags: tagsRef.current })
      );
    },
    onChange(listener: OnTagsChangeListener<TTag>) {
      onChangeListeners.push(listener);
    },
  };
}
