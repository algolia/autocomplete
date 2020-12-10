import {
  AutocompleteApi as AutocompleteCoreApi,
  AutocompleteScopeApi,
  BaseItem,
} from '@algolia/autocomplete-core';

import {
  Element,
  Form,
  Input,
  InputWrapper,
  Label,
  LoadingIndicator,
  Panel,
  ResetButton,
  Root,
  SubmitButton,
  TouchOverlay,
  TouchSearchButton,
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
  onTouchOverlayClose(): void;
  autocomplete: AutocompleteCoreApi<TItem>;
  state: AutocompleteState<TItem>;
  propGetters: AutocompletePropGetters<TItem>;
  autocompleteScopeApi: AutocompleteScopeApi<TItem>;
};

export function createAutocompleteDom<TItem extends BaseItem>({
  isTouch,
  placeholder = 'Search',
  onTouchOverlayClose,
  autocomplete,
  classNames,
  propGetters,
  state,
  autocompleteScopeApi,
}: CreateDomProps<TItem>): AutocompleteDom {
  const rootProps = propGetters.getRootProps({
    state,
    props: autocomplete.getRootProps({}),
    ...autocompleteScopeApi,
  });
  const root = Root({ classNames, ...rootProps });
  const touchOverlay = TouchOverlay({ classNames });
  const inputWrapper = InputWrapper({ classNames });
  const labelProps = propGetters.getLabelProps({
    state,
    props: autocomplete.getLabelProps({}),
    ...autocompleteScopeApi,
  });
  const label = Label({ classNames, ...labelProps });
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
  const submitButton = SubmitButton({
    classNames,
    hidden: state.status === 'stalled',
  });
  const resetButton = ResetButton({
    classNames,
    hidden: !state.query,
  });
  const loadingIndicator = LoadingIndicator({
    classNames,
    hidden: state.status !== 'stalled',
  });
  const formProps = propGetters.getFormProps({
    state,
    props: autocomplete.getFormProps({ inputElement: input }),
    ...autocompleteScopeApi,
  });
  const form = Form({ classNames, ...formProps });
  const panelProps = propGetters.getPanelProps({
    state,
    props: autocomplete.getPanelProps({}),
    ...autocompleteScopeApi,
  });
  const panel = Panel({ classNames, ...panelProps });

  label.appendChild(submitButton);
  inputWrapper.appendChild(input);
  inputWrapper.appendChild(label);
  inputWrapper.appendChild(resetButton);
  inputWrapper.appendChild(loadingIndicator);
  form.appendChild(inputWrapper);

  if (isTouch) {
    const touchFormContainer = Element('div', {
      class: 'aa-TouchFormContainer',
    });
    const touchCancelButton = Element('button', {
      textContent: 'Cancel',
      class: 'aa-TouchCancelButton',
      onClick() {
        document.body.removeChild(touchOverlay);
        onTouchOverlayClose();
      },
    });
    const touchSearchButton = TouchSearchButton({
      classNames,
      onClick(event: MouseEvent) {
        event.preventDefault();
        // todo: use panel container
        document.body.appendChild(touchOverlay);
        input.focus();
      },
    });
    const touchSearchButtonPlaceholder = Element('div', {
      textContent: placeholder,
      class: 'aa-TouchSearchButtonPlaceholder',
    });

    touchSearchButton.appendChild(label.cloneNode(true));
    touchSearchButton.appendChild(touchSearchButtonPlaceholder);
    touchFormContainer.appendChild(form);
    touchFormContainer.appendChild(touchCancelButton);
    touchOverlay.appendChild(touchFormContainer);
    root.appendChild(touchSearchButton);
  } else {
    root.appendChild(form);
  }

  return {
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
