import { AutocompleteSource } from './api';

export interface AutocompleteAccessibilityGetters<TItem> {
  getRootProps: GetRootProps;
  getFormProps: GetFormProps;
  getInputProps: GetInputProps;
  getItemProps: GetItemProps<TItem>;
  getLabelProps: GetLabelProps;
  getMenuProps: GetMenuProps;
}

export type GetRootProps = (props?: {
  [key: string]: unknown;
}) => {
  role: string;
  'aria-expanded': boolean;
  'aria-haspopup': string;
  'aria-owns': string | null;
  'aria-labelledby': string;
};

export type GetFormProps = (props: {
  [key: string]: unknown;
  inputElement: HTMLInputElement | null;
}) => {
  onSubmit(event: Event): void;
  onReset(event: Event): void;
};

export type GetInputProps = (props: {
  [key: string]: unknown;
  inputElement: HTMLInputElement;
}) => {
  id: string;
  value: string;
  autofocus: boolean;
  placeholder: string;
  autoComplete: 'on' | 'off';
  autoCorrect: 'on' | 'off';
  autoCapitalize: 'on' | 'off';
  spellCheck: boolean;
  'aria-autocomplete': 'none' | 'inline' | 'list' | 'both';
  'aria-activedescendant': string | null;
  'aria-controls': string | null;
  'aria-labelledby': string;
  onInput(event: Event): void;
  onKeyDown(event: KeyboardEvent): void;
  onFocus(): void;
  onBlur(): void;
  onClick(event: MouseEvent): void;
};

export type GetItemProps<TItem> = (props: {
  [key: string]: unknown;
  item: TItem;
  source: AutocompleteSource<TItem>;
}) => {
  id: string;
  role: string;
  'aria-selected': boolean;
  onMouseMove(event: MouseEvent): void;
  onMouseDown(event: MouseEvent): void;
  onClick(event: MouseEvent): void;
};

export type GetLabelProps = (props?: {
  [key: string]: unknown;
}) => {
  htmlFor: string;
  id: string;
};

export type GetMenuProps = (props?: {
  [key: string]: unknown;
}) => {
  role: string;
  'aria-labelledby': string;
  id: string;
};
