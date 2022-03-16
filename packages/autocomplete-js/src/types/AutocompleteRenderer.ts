import htm from 'htm';

export type Pragma = (
  type: any,
  props: Record<string, any> | null,
  ...children: ComponentChildren[]
) => JSX.Element;
export type PragmaFrag = any;

export type ComponentChild =
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
  props: TProps & { children: ComponentChildren; key?: any };
};

export type AutocompleteRenderer = {
  /**
   * The function to create virtual nodes.
   *
   * @default preact.createElement
   */
  createElement: Pragma;
  /**
   * The component to use to create fragments.
   *
   * @default preact.Fragment
   */
  Fragment: PragmaFrag;
};

export type HTMLToJSX = typeof htm;
