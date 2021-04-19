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
  /**
   * Highlight matches in an Algolia hit.
   */
  Highlight: AutocompleteHighlightComponent;
  /**
   * Reverse-highlight matches in an Algolia hit.
   */
  ReverseHighlight: AutocompleteHighlightComponent;
  /**
   * Reverse-highlight and snippets matches in an Algolia hit.
   */
  ReverseSnippet: AutocompleteHighlightComponent;
  /**
   * Snippet matches in an Algolia hit.
   */
  Snippet: AutocompleteHighlightComponent;
}
