import { TagsApi } from '..';

declare module '@algolia/autocomplete-core' {
  export interface AutocompleteContext {
    // Tags are generic but we can't pass on a generic type from the plugin
    // implementation. In the meantime we can pass `any` to avoid type errors.
    // @todo Allow typing the context in a way that allows generics.
    tagsPlugin: TagsApi<any>;
  }
}
