import {
  AutocompleteApi as AutocompleteCoreApi,
  BaseItem,
} from '@algolia/autocomplete-core';

import {
  Form,
  Input,
  InputWrapper,
  Label,
  Panel,
  ResetButton,
  Root,
} from './components';
import { AutocompleteClassNames, AutocompleteDom } from './types';

type CreateDomProps<TItem extends BaseItem> = AutocompleteCoreApi<TItem> & {
  classNames: AutocompleteClassNames;
};

export function createAutocompleteDom<TItem extends BaseItem>({
  getRootProps,
  getFormProps,
  getLabelProps,
  getInputProps,
  getPanelProps,
  classNames,
}: CreateDomProps<TItem>): AutocompleteDom {
  const root = Root({ classNames, ...getRootProps({}) });
  const inputWrapper = InputWrapper({ classNames });
  const label = Label({ classNames, ...getLabelProps({}) });
  const input = Input({ classNames, getInputProps });
  const resetButton = ResetButton({ classNames });
  const form = Form({ classNames, ...getFormProps({ inputElement: input }) });
  const panel = Panel({ classNames, ...getPanelProps({}) });

  inputWrapper.appendChild(input);
  inputWrapper.appendChild(label);
  inputWrapper.appendChild(resetButton);
  form.appendChild(inputWrapper);
  root.appendChild(form);

  return {
    inputWrapper,
    input,
    root,
    form,
    label,
    resetButton,
    panel,
  };
}
