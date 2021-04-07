import { NavigationCommandsProps } from './NavigationCommands';

declare module '@algolia/autocomplete-js' {
  export interface AutocompleteComponents {
    NavigationCommands: (props: NavigationCommandsProps) => JSX.Element;
  }
}
