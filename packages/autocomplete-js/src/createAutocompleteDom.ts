import { AutocompleteApi as AutocompleteCoreApi } from '@algolia/autocomplete-core';

import { resetIcon, searchIcon } from './icons';
import { AutocompleteClassNames, AutocompleteDom } from './types';
import { concatClassNames, setProperties } from './utils';

type CreateDomProps<TItem> = AutocompleteCoreApi<TItem> & {
  classNames: AutocompleteClassNames;
};

export function createAutocompleteDom<TItem>({
  getEnvironmentProps,
  getRootProps,
  getFormProps,
  getLabelProps,
  getInputProps,
  getPanelProps,
  classNames,
}: CreateDomProps<TItem>): AutocompleteDom {
  const inputWrapper = document.createElement('div');
  const input = document.createElement('input');
  const root = document.createElement('div');
  const form = document.createElement('form');
  const label = document.createElement('label');
  const resetButton = document.createElement('button');
  const panel = document.createElement('div');

  setProperties(
    window as any,
    getEnvironmentProps({
      searchBoxElement: form,
      panelElement: panel,
      inputElement: input,
    })
  );
  setProperties(root, {
    ...getRootProps(),
    class: concatClassNames(['aa-Autocomplete', classNames.root]),
  });
  const formProps = getFormProps({ inputElement: input });
  setProperties(form, {
    ...formProps,
    class: concatClassNames(['aa-Form', classNames.form]),
  });
  setProperties(inputWrapper, {
    class: concatClassNames(['aa-InputWrapper', classNames.inputWrapper]),
  });
  setProperties(label, {
    ...getLabelProps(),
    class: concatClassNames(['aa-Label', classNames.label]),
    innerHTML: searchIcon,
  });
  setProperties(input, {
    ...getInputProps({ inputElement: input }),
    class: concatClassNames(['aa-Input', classNames.input]),
  });
  setProperties(resetButton, {
    type: 'reset',
    onClick: formProps.onReset,
    class: concatClassNames(['aa-ResetButton', classNames.resetButton]),
    innerHTML: resetIcon,
  });
  setProperties(panel, {
    ...getPanelProps(),
    hidden: true,
    class: concatClassNames(['aa-Panel', classNames.panel]),
  });

  inputWrapper.appendChild(input);
  inputWrapper.appendChild(label);
  inputWrapper.appendChild(resetButton);
  form.appendChild(inputWrapper);
  root.appendChild(form);
  root.appendChild(panel);

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
