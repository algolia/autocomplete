import { BaseItem } from './AutocompleteApi';
import { InternalAutocompleteSource } from './AutocompleteSource';

export interface AutocompletePropGetters<
  TItem extends BaseItem,
  TEvent = Event,
  TMouseEvent = MouseEvent,
  TKeyboardEvent = KeyboardEvent
> {
  getEnvironmentProps: GetEnvironmentProps;
  getRootProps: GetRootProps;
  getFormProps: GetFormProps<TEvent>;
  getLabelProps: GetLabelProps;
  getInputProps: GetInputProps<TEvent, TMouseEvent, TKeyboardEvent>;
  getPanelProps: GetPanelProps<TMouseEvent>;
  getListProps: GetListProps;
  getItemProps: GetItemProps<TItem, TMouseEvent>;
}

export type GetEnvironmentProps = (props: {
  [key: string]: unknown;
  formElement: HTMLElement;
  inputElement: HTMLInputElement;
  panelElement: HTMLElement;
}) => {
  onTouchStart(event: TouchEvent): void;
  onTouchMove(event: TouchEvent): void;
  onMouseDown(event: MouseEvent): void;
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
  action: '';
  noValidate: true;
  role: 'search';
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
  inputElement: HTMLInputElement | null;
  maxLength?: number;
}) => {
  id: string;
  value: string;
  autoFocus: boolean;
  placeholder: string;
  autoComplete: 'on' | 'off';
  autoCorrect: 'on' | 'off';
  autoCapitalize: 'on' | 'off';
  enterKeyHint: 'go' | 'search';
  spellCheck: 'false';
  maxLength: number;
  type: 'search';
  'aria-autocomplete': 'none' | 'inline' | 'list' | 'both';
  'aria-activedescendant': string | undefined;
  'aria-controls': string | undefined;
  'aria-labelledby': string;
  onChange(event: TEvent): void;
  onKeyDown(event: TKeyboardEvent): void;
  onFocus(event: TEvent): void;
  onBlur(): void;
  onClick(event: TMouseEvent): void;
};

export type GetPanelProps<TMouseEvent> = (props?: {
  [key: string]: unknown;
}) => {
  onMouseDown(event: TMouseEvent): void;
  onMouseLeave(): void;
};

export type GetListProps = (props?: {
  [key: string]: unknown;
}) => {
  role: string;
  'aria-labelledby': string;
  id: string;
};

export type GetItemProps<
  TItem extends BaseItem,
  TMouseEvent = MouseEvent
> = (props: {
  [key: string]: unknown;
  item: TItem;
  source: InternalAutocompleteSource<TItem>;
}) => {
  id: string;
  role: string;
  'aria-selected': boolean;
  onMouseMove(event: TMouseEvent): void;
  onMouseDown(event: TMouseEvent): void;
  onClick(event: TMouseEvent): void;
};
