import { BaseItem } from '@algolia/autocomplete-core';
import { invariant } from '@algolia/autocomplete-shared';
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
  detachedCancelButton: 'aa-TouchCancelButton',
  detachedFormContainer: 'aa-TouchFormContainer',
  detachedOverlay: 'aa-TouchOverlay',
  detachedSearchButton: 'aa-TouchSearchButton',
  detachedSearchButtonIcon: 'aa-TouchSearchButtonIcon',
  detachedSearchButtonPlaceholder: 'aa-TouchSearchButtonPlaceholder',
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
};

const defaultRender: AutocompleteRender<any> = ({ children }, root) => {
  render(children, root);
};

const defaultRenderer: AutocompleteRenderer = {
  createElement: preactCreateElement,
  Fragment: PreactFragment,
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
    renderEmpty,
    renderer,
    detachedMediaQuery,
    ...core
  } = options;

  const containerElement = getHTMLElement(container);

  invariant(
    containerElement.tagName !== 'INPUT',
    'The `container` option does not support `input` elements. You need to change the container to a `div`.'
  );

  return {
    renderer: {
      classNames: mergeClassNames(
        defaultClassNames,
        classNames ?? {}
      ) as AutocompleteClassNames,
      container: containerElement,
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
      renderEmpty,
      renderer: renderer ?? defaultRenderer,
      detachedMediaQuery: detachedMediaQuery ?? '(max-width: 500px)',
    },
    core,
  };
}
