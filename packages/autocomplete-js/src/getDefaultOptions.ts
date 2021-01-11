import { BaseItem } from '@algolia/autocomplete-core';
import {
  createElement as preactCreateElement,
  Fragment as PreactFragment,
  render,
} from 'preact';

import {
  AutocompleteClassNames,
  AutocompleteOptions,
  AutocompleteRender,
  AutocompleteRenderer,
} from './types';
import { getHTMLElement, mergeClassNames } from './utils';

const defaultClassNames: AutocompleteClassNames = {
  form: 'aa-Form',
  input: 'aa-Input',
  inputWrapper: 'aa-InputWrapper',
  inputWrapperPrefix: 'aa-InputWrapperPrefix',
  inputWrapperSuffix: 'aa-InputWrapperSuffix',
  item: 'aa-Item',
  label: 'aa-Label',
  list: 'aa-List',
  loadingIndicator: 'aa-LoadingIndicator',
  panel: 'aa-Panel',
  panelLayout: 'aa-PanelLayout',
  resetButton: 'aa-ResetButton',
  root: 'aa-Autocomplete',
  source: 'aa-Source',
  sourceFooter: 'aa-SourceFooter',
  sourceHeader: 'aa-SourceHeader',
  submitButton: 'aa-SubmitButton',
  touchCancelButton: 'aa-TouchCancelButton',
  touchFormContainer: 'aa-TouchFormContainer',
  touchOverlay: 'aa-TouchOverlay',
  touchSearchButton: 'aa-TouchSearchButton',
  touchSearchButtonIcon: 'aa-TouchSearchButtonIcon',
  touchSearchButtonPlaceholder: 'aa-TouchSearchButtonPlaceholder',
};

const defaultRender: AutocompleteRender<any> = ({ children }, root) => {
  render(children, root);
};

export function getDefaultOptions<TItem extends BaseItem>(
  options: AutocompleteOptions<TItem>
) {
  const {
    classNames,
    container,
    getEnvironmentProps,
    getFormProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    getListProps,
    getPanelProps,
    getRootProps,
    panelContainer,
    panelPlacement,
    render,
    renderer,
    touchMediaQuery,
    ...core
  } = options;

  const defaultRenderer: AutocompleteRenderer = {
    createElement: preactCreateElement,
    Fragment: PreactFragment,
  };

  return {
    renderer: {
      classNames: mergeClassNames(
        defaultClassNames,
        classNames ?? {}
      ) as AutocompleteClassNames,
      container: getHTMLElement(container),
      getEnvironmentProps: getEnvironmentProps ?? (({ props }) => props),
      getFormProps: getFormProps ?? (({ props }) => props),
      getInputProps: getInputProps ?? (({ props }) => props),
      getItemProps: getItemProps ?? (({ props }) => props),
      getLabelProps: getLabelProps ?? (({ props }) => props),
      getListProps: getListProps ?? (({ props }) => props),
      getPanelProps: getPanelProps ?? (({ props }) => props),
      getRootProps: getRootProps ?? (({ props }) => props),
      panelContainer: panelContainer
        ? getHTMLElement(panelContainer)
        : document.body,
      panelPlacement: panelPlacement ?? 'input-wrapper-width',
      render: render ?? defaultRender,
      renderer: renderer ?? defaultRenderer,
      touchMediaQuery: touchMediaQuery ?? '(hover: none) and (pointer: coarse)',
    },
    core,
  };
}
