export type Pragma = (
  type: any,
  props: Record<string, any> | null,
  ...children: ComponentChildren[]
) => VNode;
export type PragmaFrag = any;

type ComponentChild =
  | VNode<any>
  | object
  | string
  | number
  | boolean
  | null
  | undefined;
type ComponentChildren = ComponentChild[] | ComponentChild;

export type VNode<TProps = any> = {
  type: any;
  props: TProps & { children: ComponentChildren };
};

export type AutocompleteRenderer = {
  /**
   * Function used to create elements.
   *
   * @default preact.createElement
   */
  createElement: Pragma;
  /**
   * Component used for fragments.
   *
   * @default preact.Fragment
   */
  Fragment: PragmaFrag;
};
