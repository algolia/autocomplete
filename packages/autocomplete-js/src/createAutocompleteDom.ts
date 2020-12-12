import {
  AutocompleteApi as AutocompleteCoreApi,
  AutocompleteScopeApi,
  BaseItem,
} from '@algolia/autocomplete-core';

import {
  Element,
  Input,
  LoadingIcon,
  ResetIcon,
  SearchIcon,
} from './components';
import {
  AutocompleteClassNames,
  AutocompleteDom,
  AutocompletePropGetters,
  AutocompleteState,
} from './types';
import { setProperties } from './utils';

type CreateDomProps<TItem extends BaseItem> = {
  classNames: AutocompleteClassNames;
  isTouch: boolean;
  placeholder?: string;
  autocomplete: AutocompleteCoreApi<TItem>;
  state: AutocompleteState<TItem>;
  propGetters: AutocompletePropGetters<TItem>;
  autocompleteScopeApi: AutocompleteScopeApi<TItem>;
};

type CreateAutocompleteDomReturn = AutocompleteDom & {
  openTouchOverlay(): void;
};

export function createAutocompleteDom<TItem extends BaseItem>({
  isTouch,
  placeholder = 'Search',
  autocomplete,
  classNames,
  propGetters,
  state,
  autocompleteScopeApi,
}: CreateDomProps<TItem>): CreateAutocompleteDomReturn {
  function onTouchOverlayClose() {
    autocomplete.setQuery('');
    autocomplete.setIsOpen(false);
    autocomplete.refresh();
  }

  const rootProps = propGetters.getRootProps({
    state,
    props: autocomplete.getRootProps({}),
    ...autocompleteScopeApi,
  });
  const root = Element('div', { class: classNames.root, ...rootProps });
  const touchOverlay = Element('div', { class: classNames.touchOverlay });

  const labelProps = propGetters.getLabelProps({
    state,
    props: autocomplete.getLabelProps({}),
    ...autocompleteScopeApi,
  });
  const submitButton = Element('button', {
    class: classNames.submitButton,
    type: 'submit',
    children: [SearchIcon({})],
  });
  const label = Element('label', {
    class: classNames.label,
    children: [submitButton],
    ...labelProps,
  });
  const resetButton = Element('button', {
    class: classNames.resetButton,
    type: 'reset',
    children: [ResetIcon({})],
  });
  const loadingIndicator = Element('div', {
    class: classNames.loadingIndicator,
    children: [LoadingIcon({})],
  });

  const input = Input({
    class: classNames.input,
    state,
    getInputProps: propGetters.getInputProps,
    getInputPropsCore: autocomplete.getInputProps,
    autocompleteScopeApi,
    onTouchEscape: isTouch
      ? () => {
          document.body.removeChild(touchOverlay);
          onTouchOverlayClose();
        }
      : undefined,
  });

  const inputWrapperPrefix = Element('div', {
    class: classNames.inputWrapperPrefix,
    children: [label, loadingIndicator],
  });
  const inputWrapperSuffix = Element('div', {
    class: classNames.inputWrapperSuffix,
    children: [resetButton],
  });
  const inputWrapper = Element('div', {
    class: classNames.inputWrapper,
    children: [input],
  });

  const formProps = propGetters.getFormProps({
    state,
    props: autocomplete.getFormProps({ inputElement: input }),
    ...autocompleteScopeApi,
  });
  const form = Element('form', {
    class: classNames.form,
    children: [inputWrapperPrefix, inputWrapper, inputWrapperSuffix],
    ...formProps,
  });
  const panelProps = propGetters.getPanelProps({
    state,
    props: autocomplete.getPanelProps({}),
    ...autocompleteScopeApi,
  });
  const panel = Element('div', { class: classNames.panel, ...panelProps });

  if (__TEST__) {
    setProperties(panel, {
      'data-testid': 'panel',
    });
  }

  function openTouchOverlay() {
    document.body.appendChild(touchOverlay);
    input.focus();
  }

  if (isTouch) {
    const touchSearchButtonIcon = Element('div', {
      class: classNames.touchSearchButtonIcon,
      children: [SearchIcon({})],
    });
    const touchSearchButtonPlaceholder = Element('div', {
      class: classNames.touchSearchButtonPlaceholder,
      textContent: placeholder,
    });
    const touchSearchButton = Element('button', {
      class: classNames.touchSearchButton,
      onClick(event: MouseEvent) {
        event.preventDefault();
        document.body.appendChild(touchOverlay);
        input.focus();
      },
      children: [touchSearchButtonIcon, touchSearchButtonPlaceholder],
    });
    const touchCancelButton = Element('button', {
      class: classNames.touchCancelButton,
      textContent: 'Cancel',
      onClick() {
        document.body.removeChild(touchOverlay);
        onTouchOverlayClose();
      },
    });
    const touchFormContainer = Element('div', {
      class: classNames.touchFormContainer,
      children: [form, touchCancelButton],
    });

    touchOverlay.appendChild(touchFormContainer);
    root.appendChild(touchSearchButton);
  } else {
    root.appendChild(form);
  }

  return {
    openTouchOverlay,
    touchOverlay,
    inputWrapper,
    input,
    root,
    form,
    label,
    submitButton,
    resetButton,
    loadingIndicator,
    panel,
  };
}
