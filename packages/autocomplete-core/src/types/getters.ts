import { AutocompleteSource } from './api';

export interface AutocompleteAccessibilityGetters<
  TItem,
  TEvent = Event,
  TMouseEvent = MouseEvent,
  TKeyboardEvent = KeyboardEvent
> {
  getEnvironmentProps: GetEnvironmentProps;
  getRootProps: GetRootProps;
  getFormProps: GetFormProps<TEvent>;
  getLabelProps: GetLabelProps;
  getInputProps: GetInputProps<TEvent, TMouseEvent, TKeyboardEvent>;
  getDropdownProps: GetDropdownProps;
  getMenuProps: GetMenuProps;
  getItemProps: GetItemProps<TItem, TMouseEvent>;
}

export type GetEnvironmentProps = (props: {
  [key: string]: unknown;
  searchBoxElement: HTMLElement;
  dropdownElement: HTMLElement;
  inputElement: HTMLInputElement;
}) => {
  onTouchStart(event: TouchEvent): void;
  onTouchMove(event: TouchEvent): void;
};

export type GetRootProps = (props?: {
  [key: string]: unknown;
}) => {
  role: string;
  'aria-expanded': boolean;
  'aria-haspopup':
    | boolean
    | 'dialog'
    | 'menu'
    | 'true'
    | 'false'
    | 'grid'
    | 'listbox'
    | 'tree'
    | undefined;
  'aria-owns': string | undefined;
  'aria-labelledby': string;
};

export type GetFormProps<TEvent = Event> = (props: {
  [key: string]: unknown;
  inputElement: HTMLInputElement | null;
}) => {
  onSubmit(event: TEvent): void;
  onReset(event: TEvent): void;
};

export type GetLabelProps = (props?: {
  [key: string]: unknown;
}) => {
  htmlFor: string;
  id: string;
};

export type GetInputProps<TEvent, TMouseEvent, TKeyboardEvent> = (props: {
  [key: string]: unknown;
  inputElement: HTMLInputElement;
  maxLength?: number;
}) => {
  id: string;
  value: string;
  autoFocus: boolean;
  placeholder: string;
  autoComplete: 'on' | 'off';
  autoCorrect: 'on' | 'off';
  autoCapitalize: 'on' | 'off';
  spellCheck: boolean;
  maxLength: number;
  'aria-autocomplete': 'none' | 'inline' | 'list' | 'both';
  'aria-activedescendant': string | undefined;
  'aria-controls': string | undefined;
  'aria-labelledby': string;
  onChange(event: TEvent): void;
  onKeyDown(event: TKeyboardEvent): void;
  onFocus(): void;
  onBlur(): void;
  onClick(event: TMouseEvent): void;
};

export type GetDropdownProps = (props?: {
  [key: string]: unknown;
}) => {
  onMouseLeave(): void;
};

export type GetMenuProps = (props?: {
  [key: string]: unknown;
}) => {
  role: string;
  'aria-labelledby': string;
  id: string;
};

export type GetItemProps<TItem, TMouseEvent = MouseEvent> = (props: {
  [key: string]: unknown;
  item: TItem;
  source: AutocompleteSource<TItem>;
}) => {
  id: string;
  role: string;
  'aria-selected': boolean;
  onMouseMove(event: TMouseEvent): void;
  onMouseDown(event: TMouseEvent): void;
  onClick(event: TMouseEvent): void;
};
