import { AutocompleteClassNames } from './AutocompleteClassNames';

export type WithClassNames<TProps> = TProps & {
  classNames: Partial<AutocompleteClassNames>;
};

export type Component<
  TProps = {},
  TElement extends HTMLOrSVGElement = HTMLOrSVGElement
> = (props: TProps) => TElement;
