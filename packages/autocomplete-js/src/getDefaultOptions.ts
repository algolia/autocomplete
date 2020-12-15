import { BaseItem } from '@algolia/autocomplete-core';
import { createElement, Fragment, render } from 'preact';

import {
  AutocompleteClassNames,
  AutocompleteOptions,
  AutocompleteRenderer,
  Pragma,
  PragmaFrag,
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

const defaultRender: AutocompleteRenderer<any> = ({ children }, root) => {
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
    pragma,
    pragmaFrag,
    render,
    touchMediaQuery,
    ...core
  } = options;
  const renderer = {
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
    pragma: pragma ?? (createElement as Pragma),
    pragmaFrag: pragmaFrag ?? (Fragment as PragmaFrag),
    render: render ?? defaultRender,
    touchMediaQuery: touchMediaQuery ?? '(hover: none) and (pointer: coarse)',
  };

  return {
    renderer,
    core,
  };
}
