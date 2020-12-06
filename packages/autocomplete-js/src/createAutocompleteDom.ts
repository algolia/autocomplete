import {
  AutocompleteApi as AutocompleteCoreApi,
  BaseItem,
} from '@algolia/autocomplete-core';

import {
  Form,
  Input,
  InputWrapper,
  Label,
  LoadingIndicator,
  Panel,
  ResetButton,
  Root,
  SubmitButton,
} from './components';
import {
  AutocompleteClassNames,
  AutocompleteDom,
  AutocompletePropGetters,
  AutocompleteState,
} from './types';

type CreateDomProps<TItem extends BaseItem> = AutocompletePropGetters<TItem> & {
  classNames: Partial<AutocompleteClassNames>;
  autocomplete: AutocompleteCoreApi<TItem>;
  state: AutocompleteState<TItem>;
};

export function createAutocompleteDom<TItem extends BaseItem>({
  autocomplete,
  classNames,
  getRootProps,
  getFormProps,
  getLabelProps,
  getInputProps,
  getPanelProps,
  state,
}: CreateDomProps<TItem>): AutocompleteDom {
  const root = Root({
    classNames,
    ...getRootProps({
      state,
      props: autocomplete.getRootProps({}),
    }),
  });
  const inputWrapper = InputWrapper({ classNames });
  const label = Label({
    classNames,
    ...getLabelProps({ state, props: autocomplete.getLabelProps({}) }),
  });
  const input = Input({
    classNames,
    state,
    getInputProps,
    getInputPropsCore: autocomplete.getInputProps,
  });
  const submitButton = SubmitButton({ classNames });
  const resetButton = ResetButton({ classNames });
  const loadingIndicator = LoadingIndicator({ classNames });
  const form = Form({
    classNames,
    ...getFormProps({
      state,
      props: autocomplete.getFormProps({ inputElement: input }),
    }),
  });
  const panel = Panel({
    classNames,
    ...getPanelProps({ state, props: autocomplete.getPanelProps({}) }),
  });

  label.appendChild(submitButton);
  inputWrapper.appendChild(input);
  inputWrapper.appendChild(label);
  inputWrapper.appendChild(resetButton);
  inputWrapper.appendChild(loadingIndicator);
  form.appendChild(inputWrapper);
  root.appendChild(form);

  return {
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
