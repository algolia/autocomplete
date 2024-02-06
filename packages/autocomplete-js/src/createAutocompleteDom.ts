import {
  AutocompleteApi as AutocompleteCoreApi,
  AutocompleteEnvironment,
  AutocompleteScopeApi,
  BaseItem,
} from '@algolia/autocomplete-core';

import { ClearIcon, Input, LoadingIcon, SearchIcon } from './elements';
import { getCreateDomElement } from './getCreateDomElement';
import {
  AutocompleteClassNames,
  AutocompleteDom,
  AutocompletePropGetters,
  AutocompleteState,
  AutocompleteTranslations,
} from './types';
import { setProperties } from './utils';

type CreateDomProps<TItem extends BaseItem> = {
  autocomplete: AutocompleteCoreApi<TItem>;
  autocompleteScopeApi: AutocompleteScopeApi<TItem>;
  classNames: AutocompleteClassNames;
  environment: AutocompleteEnvironment;
  isDetached: boolean;
  placeholder?: string;
  propGetters: AutocompletePropGetters<TItem>;
  setIsModalOpen(value: boolean): void;
  state: AutocompleteState<TItem>;
  translations: AutocompleteTranslations;
};

export function createAutocompleteDom<TItem extends BaseItem>({
  autocomplete,
  autocompleteScopeApi,
  classNames,
  environment,
  isDetached,
  placeholder = 'Search',
  propGetters,
  setIsModalOpen,
  state,
  translations,
}: CreateDomProps<TItem>): AutocompleteDom {
  const createDomElement = getCreateDomElement(environment);

  const rootProps = propGetters.getRootProps({
    state,
    props: autocomplete.getRootProps({}),
    ...autocompleteScopeApi,
  });
  const root = createDomElement('div', {
    class: classNames.root,
    ...rootProps,
  });
  const detachedContainer = createDomElement('div', {
    class: classNames.detachedContainer,
    onMouseDown(event: MouseEvent) {
      event.stopPropagation();
    },
  });
  const detachedOverlay = createDomElement('div', {
    class: classNames.detachedOverlay,
    children: [detachedContainer],
    onMouseDown() {
      setIsModalOpen(false);
      autocomplete.setIsOpen(false);
    },
  });

  const labelProps = propGetters.getLabelProps({
    state,
    props: autocomplete.getLabelProps({}),
    ...autocompleteScopeApi,
  });
  const submitButton = createDomElement('button', {
    class: classNames.submitButton,
    type: 'submit',
    title: translations.submitButtonTitle,
    children: [SearchIcon({ environment })],
  });
  const label = createDomElement('label', {
    class: classNames.label,
    children: [submitButton],
    ...labelProps,
  });
  const clearButton = createDomElement('button', {
    class: classNames.clearButton,
    type: 'reset',
    title: translations.clearButtonTitle,
    children: [ClearIcon({ environment })],
  });
  const loadingIndicator = createDomElement('div', {
    class: classNames.loadingIndicator,
    children: [LoadingIcon({ environment })],
  });

  const input = Input({
    class: classNames.input,
    environment,
    state,
    getInputProps: propGetters.getInputProps,
    getInputPropsCore: autocomplete.getInputProps,
    autocompleteScopeApi,
    isDetached,
  });

  const inputWrapperPrefix = createDomElement('div', {
    class: classNames.inputWrapperPrefix,
    children: [label, loadingIndicator],
  });
  const inputWrapperSuffix = createDomElement('div', {
    class: classNames.inputWrapperSuffix,
    children: [clearButton],
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

  const detachedSearchButtonQuery = createDomElement('div', {
    class: classNames.detachedSearchButtonQuery,
    textContent: state.query,
  });
  const detachedSearchButtonPlaceholder = createDomElement('div', {
    class: classNames.detachedSearchButtonPlaceholder,
    hidden: Boolean(state.query),
    textContent: placeholder,
  });

  if (__TEST__) {
    setProperties(panel, {
      'data-testid': 'panel',
    });
  }

  if (isDetached) {
    const detachedSearchButtonIcon = createDomElement('div', {
      class: classNames.detachedSearchButtonIcon,
      children: [SearchIcon({ environment })],
    });
    const detachedSearchButton = createDomElement('button', {
      type: 'button',
      class: classNames.detachedSearchButton,
      title: translations.detachedSearchButtonTitle,
      id: labelProps.id,
      onClick() {
        setIsModalOpen(true);
      },
      children: [
        detachedSearchButtonIcon,
        detachedSearchButtonPlaceholder,
        detachedSearchButtonQuery,
      ],
    });
    const detachedCancelButton = createDomElement('button', {
      type: 'button',
      class: classNames.detachedCancelButton,
      textContent: translations.detachedCancelButtonText,
      // Prevent `onTouchStart` from closing the panel
      // since it should be initiated by `onClick` only
      onTouchStart(event: TouchEvent) {
        event.stopPropagation();
      },
      onClick() {
        autocomplete.setIsOpen(false);
        setIsModalOpen(false);
      },
    });
    const detachedFormContainer = createDomElement('div', {
      class: classNames.detachedFormContainer,
      children: [form, detachedCancelButton],
    });

    detachedContainer.appendChild(detachedFormContainer);
    root.appendChild(detachedSearchButton);
  } else {
    root.appendChild(form);
  }

  return {
    detachedContainer,
    detachedOverlay,
    detachedSearchButtonQuery,
    detachedSearchButtonPlaceholder,
    inputWrapper,
    input,
    root,
    form,
    label,
    submitButton,
    clearButton,
    loadingIndicator,
    panel,
  };
}
