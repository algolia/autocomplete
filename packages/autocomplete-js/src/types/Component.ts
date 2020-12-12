type WithComponentProps<TProps> = TProps &
  Record<string, unknown> & {
    children?: Node[];
  };

export type Component<
  TProps = {},
  TElement extends HTMLOrSVGElement = HTMLOrSVGElement
> = (props: WithComponentProps<TProps>) => TElement;
