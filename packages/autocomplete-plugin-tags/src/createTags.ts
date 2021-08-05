import { createRef } from '@algolia/autocomplete-shared';

import { CreateTagsPluginParams } from './createTagsPlugin';
import { BaseTag, Tag } from './types';

type OnTagsChangeListener<TTag> = (tags: Array<Tag<TTag>>) => void;

type CreateTagsParams<TTag> = Pick<CreateTagsPluginParams<TTag>, 'initialTags'>;

export function createTags<TTag>({ initialTags = [] }: CreateTagsParams<TTag>) {
  const tagsRef = createRef(toTags(initialTags));
  const onChangeListeners: Array<OnTagsChangeListener<TTag>> = [];

  function toTags<TTag>(tags: Array<BaseTag<TTag>>): Array<Tag<TTag>> {
    return tags.map((tag) => ({
      ...tag,
      remove() {
        const newTags = tagsRef.current.filter((tagRef) => this !== tagRef);

        tagsRef.current = newTags;
        onChangeListeners.forEach((listener) => listener(newTags));
      },
    }));
  }

  return {
    get() {
      return tagsRef.current;
    },
    set(tags: Array<BaseTag<TTag>>) {
      tagsRef.current = toTags(tags);
      onChangeListeners.forEach((listener) => listener(tagsRef.current));
    },
    add(tags: Array<BaseTag<TTag>>) {
      tagsRef.current.push(...toTags(tags));
      onChangeListeners.forEach((listener) => listener(tagsRef.current));
    },
    onChange(listener: OnTagsChangeListener<TTag>) {
      onChangeListeners.push(listener);
    },
  };
}
