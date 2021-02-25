---
id: prop-getters
title: Advanced customization with Prop Getters
---

The prop getters are functions that returns attributes and event handlers to create accessible and interactive autocomplete experiences.

## `getEnvironmentProps`

Returns the props to attach to the [environment](#environment).

You need to pass `formElement`, `panelElement` and `inputElement` so that the library creates the correct touch events for touch devices.

```ts
type GetEnvironmentProps = (props: {
  [key: string]: unknown;
  formElement: HTMLElement;
  inputElement: HTMLInputElement;
  panelElement: HTMLElement;
}) => {
  onTouchStart(event: TouchEvent): void;
  onTouchMove(event: TouchEvent): void;
};
```

## `getRootProps`

Returns the props to attach to the root element.

```ts
type GetRootProps = (props?: {
  [key: string]: unknown;
}) => {
  role: string;
  'aria-expanded': boolean;
  'aria-haspopup': string;
  'aria-owns': string;
  'aria-labelledby': string;
};
```

## `getFormProps`

Returns the props to attach to the form element.

You need to pass the `inputElement` so that the library can manage the focus of the input.

```ts
type GetFormProps = (props: {
  [key: string]: unknown;
  inputElement: HTMLInputElement | null;
}) => {
  onSubmit(event: Event): void;
  onReset(event: Event): void;
};
```

## `getInputProps`

Returns the props to attach to the input element.

You need to pass the `inputElement` so that the library can manage the focus of the input.

```ts
type GetInputProps = (props: {
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
  enterKeyHint: 'go' | 'search';
  spellCheck: 'false';
  'aria-autocomplete': 'none' | 'inline' | 'list' | 'both';
  'aria-activedescendant': string | undefined;
  'aria-controls': string | null;
  'aria-labelledby': string;
  onInput(event: Event): void;
  onKeyDown(event: KeyboardEvent): void;
  onFocus(): void;
  onBlur(): void;
  onClick(event: MouseEvent): void;
};
```

## `getItemProps`

Returns the props to attach to each item.

You need to pass the `item` and the `source` so that the library computes the state.

```ts
type GetItemProps<TItem> = (props: {
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
```

## `getLabelProps`

Returns the props to attach to the label.

```ts
type GetLabelProps = (props?: {
  [key: string]: unknown;
}) => {
  htmlFor: string;
  id: string;
};
```

## `getListProps`

Returns the props to attach to the list.

```ts
type GetListProps = (props?: {
  [key: string]: unknown;
}) => {
  role: string;
  'aria-labelledby': string;
  id: string;
};
```
