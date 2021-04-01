import { HighlightHitParams } from '.';

type AutocompleteHighlightComponent = <THit>({
  hit,
  attribute,
  tagName,
}: HighlightHitParams<THit>) => JSX.Element;

export type PublicAutocompleteComponents = Record<
  string,
  (props: any) => JSX.Element
>;

export interface AutocompleteComponents extends PublicAutocompleteComponents {
  Highlight: AutocompleteHighlightComponent;
  ReverseHighlight: AutocompleteHighlightComponent;
  ReverseSnippet: AutocompleteHighlightComponent;
  Snippet: AutocompleteHighlightComponent;
}
