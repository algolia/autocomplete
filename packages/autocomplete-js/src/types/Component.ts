import { AutocompleteClassNames } from './AutocompleteClassNames';

export type WithClassNames<TProps> = TProps & {
  classNames: Partial<AutocompleteClassNames>;
};

type WithComponentProps<TProps> = TProps &
  Record<string, unknown> & {
    children?: Node[];
  };

export type Component<
  TProps = {},
  TElement extends HTMLOrSVGElement = HTMLOrSVGElement
> = (props: WithComponentProps<TProps>) => TElement;
