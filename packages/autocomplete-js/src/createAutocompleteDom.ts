import {
  AutocompleteApi as AutocompleteCoreApi,
  BaseItem,
} from '@algolia/autocomplete-core';

import {
  Element,
  Form,
  Input,
  InputWrapper,
  Label,
  Panel,
  ResetButton,
  Root,
  TouchOverlay,
  TouchSearchButton,
} from './components';
import { AutocompleteClassNames, AutocompleteDom } from './types';

type CreateDomProps<TItem extends BaseItem> = AutocompleteCoreApi<TItem> & {
  classNames: AutocompleteClassNames;
  isTouch: boolean;
  placeholder?: string;
  onTouchOverlayClose(): void;
};

export function createAutocompleteDom<TItem extends BaseItem>({
  isTouch,
  placeholder = 'Search',
  onTouchOverlayClose,
  getRootProps,
  getFormProps,
  getLabelProps,
  getInputProps,
  getPanelProps,
  classNames,
}: CreateDomProps<TItem>): AutocompleteDom {
  const root = Root({ classNames, ...getRootProps({}) });
  const touchOverlay = TouchOverlay({ classNames });
  const inputWrapper = InputWrapper({ classNames });
  const label = Label({ classNames, ...getLabelProps({}) });
  const input = Input({
    classNames,
    getInputProps,
    onTouchEscape: isTouch
      ? () => {
          document.body.removeChild(touchOverlay);
          onTouchOverlayClose();
        }
      : undefined,
  });
  const resetButton = ResetButton({ classNames });
  const form = Form({ classNames, ...getFormProps({ inputElement: input }) });
  const panel = Panel({ classNames, ...getPanelProps({}) });

  inputWrapper.appendChild(input);
  inputWrapper.appendChild(label);
  inputWrapper.appendChild(resetButton);
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
    resetButton,
    panel,
  };
}
