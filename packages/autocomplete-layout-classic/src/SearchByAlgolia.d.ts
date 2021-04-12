import { SearchByAlgoliaProps } from './SearchByAlgolia';

declare module '@algolia/autocomplete-js' {
  export interface AutocompleteComponents {
    SearchByAlgolia: (props: SearchByAlgoliaProps) => JSX.Element;
  }
}
