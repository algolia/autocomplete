import {
  AutocompleteApi as AutocompleteCoreApi,
  AutocompleteScopeApi,
  BaseItem,
} from '@algolia/autocomplete-core';

import {
  Form,
  Input,
  InputWrapper,
  InputWrapperPrefix,
  InputWrapperSuffix,
  Label,
  LoadingIndicator,
  Panel,
  ResetButton,
  Root,
  SubmitButton,
  TouchCancelButton,
  TouchFormContainer,
  TouchOverlay,
  TouchSearchButton,
  TouchSearchButtonIcon,
  TouchSearchButtonPlaceholder,
} from './components';
import {
  AutocompleteClassNames,
  AutocompleteDom,
  AutocompletePropGetters,
  AutocompleteState,
} from './types';

type CreateDomProps<TItem extends BaseItem> = {
  classNames: Partial<AutocompleteClassNames>;
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
  const root = Root({ classNames, ...rootProps });
  const touchOverlay = TouchOverlay({ classNames });

  const labelProps = propGetters.getLabelProps({
    state,
    props: autocomplete.getLabelProps({}),
    ...autocompleteScopeApi,
  });
  const submitButton = SubmitButton({ classNames });
  const label = Label({ classNames, children: [submitButton], ...labelProps });
  const resetButton = ResetButton({ classNames });
  const loadingIndicator = LoadingIndicator({ classNames });

  const input = Input({
    state,
    getInputProps: propGetters.getInputProps,
    getInputPropsCore: autocomplete.getInputProps,
    autocompleteScopeApi,
    classNames,
    onTouchEscape: isTouch
      ? () => {
          document.body.removeChild(touchOverlay);
          onTouchOverlayClose();
        }
      : undefined,
  });

  const inputWrapperPrefix = InputWrapperPrefix({
    classNames,
    children: [label, loadingIndicator],
  });
  const inputWrapperSuffix = InputWrapperSuffix({
    classNames,
    children: [resetButton],
  });
  const inputWrapper = InputWrapper({
    classNames,
    children: [input],
  });

  const formProps = propGetters.getFormProps({
    state,
    props: autocomplete.getFormProps({ inputElement: input }),
    ...autocompleteScopeApi,
  });
  const form = Form({
    classNames,
    children: [inputWrapperPrefix, inputWrapper, inputWrapperSuffix],
    ...formProps,
  });
  const panelProps = propGetters.getPanelProps({
    state,
    props: autocomplete.getPanelProps({}),
    ...autocompleteScopeApi,
  });
  const panel = Panel({ classNames, ...panelProps });

  function openTouchOverlay() {
    document.body.appendChild(touchOverlay);
    input.focus();
  }

  if (isTouch) {
    const touchSearchButtonIcon = TouchSearchButtonIcon({ classNames });
    const touchSearchButtonPlaceholder = TouchSearchButtonPlaceholder({
      classNames,
      textContent: placeholder,
    });
    const touchSearchButton = TouchSearchButton({
      classNames,
      onClick(event: MouseEvent) {
        event.preventDefault();
        document.body.appendChild(touchOverlay);
        input.focus();
      },
      children: [touchSearchButtonIcon, touchSearchButtonPlaceholder],
    });
    const touchCancelButton = TouchCancelButton({
      classNames,
      onClick() {
        document.body.removeChild(touchOverlay);
        onTouchOverlayClose();
      },
    });
    const touchFormContainer = TouchFormContainer({
      classNames,
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
