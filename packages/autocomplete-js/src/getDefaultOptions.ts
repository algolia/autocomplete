import { BaseItem } from '@algolia/autocomplete-core';

import { defaultRenderer } from './defaultRenderer';
import { AutocompleteClassNames, AutocompleteOptions } from './types';
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
  sourceEmpty: 'aa-SourceEmpty',
  submitButton: 'aa-SubmitButton',
  touchCancelButton: 'aa-TouchCancelButton',
  touchFormContainer: 'aa-TouchFormContainer',
  touchOverlay: 'aa-TouchOverlay',
  touchSearchButton: 'aa-TouchSearchButton',
  touchSearchButtonIcon: 'aa-TouchSearchButtonIcon',
  touchSearchButtonPlaceholder: 'aa-TouchSearchButtonPlaceholder',
};

export function getDefaultOptions<TItem extends BaseItem>(
  options: AutocompleteOptions<TItem>
) {
  const {
    container,
    panelContainer,
    render,
    renderEmpty,
    panelPlacement,
    classNames,
    touchMediaQuery,
    getEnvironmentProps,
    getFormProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    getListProps,
    getPanelProps,
    getRootProps,
    ...core
  } = options;
  const renderer = {
    container: getHTMLElement(container),
    panelContainer: panelContainer
      ? getHTMLElement(panelContainer)
      : document.body,
    render: render ?? defaultRenderer,
    renderEmpty,
    panelPlacement: panelPlacement ?? 'input-wrapper-width',
    classNames: mergeClassNames(
      defaultClassNames,
      classNames ?? {}
    ) as AutocompleteClassNames,
    touchMediaQuery: touchMediaQuery ?? '(hover: none) and (pointer: coarse)',
    getEnvironmentProps: getEnvironmentProps ?? (({ props }) => props),
    getFormProps: getFormProps ?? (({ props }) => props),
    getInputProps: getInputProps ?? (({ props }) => props),
    getItemProps: getItemProps ?? (({ props }) => props),
    getLabelProps: getLabelProps ?? (({ props }) => props),
    getListProps: getListProps ?? (({ props }) => props),
    getPanelProps: getPanelProps ?? (({ props }) => props),
    getRootProps: getRootProps ?? (({ props }) => props),
  };

  return {
    renderer,
    core,
  };
}
