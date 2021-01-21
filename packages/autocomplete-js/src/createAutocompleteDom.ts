import {
  AutocompleteApi as AutocompleteCoreApi,
  AutocompleteScopeApi,
  BaseItem,
} from '@algolia/autocomplete-core';

import { Input, LoadingIcon, ResetIcon, SearchIcon } from './components';
import { createDomElement } from './createDomElement';
import {
  AutocompleteClassNames,
  AutocompleteDom,
  AutocompletePropGetters,
  AutocompleteState,
} from './types';
import { setProperties } from './utils';

type CreateDomProps<TItem extends BaseItem> = {
  autocomplete: AutocompleteCoreApi<TItem>;
  autocompleteScopeApi: AutocompleteScopeApi<TItem>;
  classNames: AutocompleteClassNames;
  isTouch: boolean;
  placeholder?: string;
  propGetters: AutocompletePropGetters<TItem>;
  state: AutocompleteState<TItem>;
};

type CreateAutocompleteDomReturn = AutocompleteDom & {
  openTouchOverlay(): void;
};

export function createAutocompleteDom<TItem extends BaseItem>({
  autocomplete,
  autocompleteScopeApi,
  classNames,
  isTouch,
  placeholder = 'Search',
  propGetters,
  state,
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
  const root = createDomElement('div', {
    class: classNames.root,
    ...rootProps,
  });
  const touchOverlay = createDomElement('div', {
    class: classNames.touchOverlay,
  });

  const labelProps = propGetters.getLabelProps({
    state,
    props: autocomplete.getLabelProps({}),
    ...autocompleteScopeApi,
  });
  const submitButton = createDomElement('button', {
    class: classNames.submitButton,
    type: 'submit',
    children: [SearchIcon({})],
  });
  const label = createDomElement('label', {
    class: classNames.label,
    children: [submitButton],
    ...labelProps,
  });
  const resetButton = createDomElement('button', {
    class: classNames.resetButton,
    type: 'reset',
    children: [ResetIcon({})],
  });
  const loadingIndicator = createDomElement('div', {
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

  const inputWrapperPrefix = createDomElement('div', {
    class: classNames.inputWrapperPrefix,
    children: [label, loadingIndicator],
  });
  const inputWrapperSuffix = createDomElement('div', {
    class: classNames.inputWrapperSuffix,
    children: [resetButton],
  });
  const inputWrapper = createDomElement('div', {
    class: classNames.inputWrapper,
    children: [input],
  });

  const formProps = propGetters.getFormProps({
    state,
    props: autocomplete.getFormProps({ inputElement: input }),
    ...autocompleteScopeApi,
  });
  const form = createDomElement('form', {
    class: classNames.form,
    children: [inputWrapperPrefix, inputWrapper, inputWrapperSuffix],
    ...formProps,
  });
  const panelProps = propGetters.getPanelProps({
    state,
    props: autocomplete.getPanelProps({}),
    ...autocompleteScopeApi,
  });
  const panel = createDomElement('div', {
    class: classNames.panel,
    ...panelProps,
  });

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
    const touchSearchButtonIcon = createDomElement('div', {
      class: classNames.touchSearchButtonIcon,
      children: [SearchIcon({})],
    });
    const touchSearchButtonPlaceholder = createDomElement('div', {
      class: classNames.touchSearchButtonPlaceholder,
      textContent: placeholder,
    });
    const touchSearchButton = createDomElement('button', {
      class: classNames.touchSearchButton,
      onClick(event: MouseEvent) {
        event.preventDefault();
        document.body.appendChild(touchOverlay);
        input.focus();
      },
      children: [touchSearchButtonIcon, touchSearchButtonPlaceholder],
    });
    const touchCancelButton = createDomElement('button', {
      class: classNames.touchCancelButton,
      textContent: 'Cancel',
      onClick() {
        document.body.removeChild(touchOverlay);
        onTouchOverlayClose();
      },
    });
    const touchFormContainer = createDomElement('div', {
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
