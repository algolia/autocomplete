import {
  AutocompleteApi as AutocompleteCoreApi,
  AutocompleteScopeApi,
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

type CreateDomProps<TItem extends BaseItem> = {
  classNames: Partial<AutocompleteClassNames>;
  autocomplete: AutocompleteCoreApi<TItem>;
  state: AutocompleteState<TItem>;
  propGetters: AutocompletePropGetters<TItem>;
  autocompleteScopeApi: AutocompleteScopeApi<TItem>;
};

export function createAutocompleteDom<TItem extends BaseItem>({
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
  const inputWrapper = InputWrapper({ classNames });
  const labelProps = propGetters.getLabelProps({
    state,
    props: autocomplete.getLabelProps({}),
    ...autocompleteScopeApi,
  });
  const label = Label({ classNames, ...labelProps });
  const input = Input({
    classNames,
    state,
    getInputProps: propGetters.getInputProps,
    getInputPropsCore: autocomplete.getInputProps,
    autocompleteScopeApi,
  });
  const submitButton = SubmitButton({ classNames });
  const resetButton = ResetButton({ classNames });
  const loadingIndicator = LoadingIndicator({ classNames });
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
