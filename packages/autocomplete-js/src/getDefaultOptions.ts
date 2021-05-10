import { AutocompleteEnvironment, BaseItem } from '@algolia/autocomplete-core';
import {
  generateAutocompleteId,
  invariant,
} from '@algolia/autocomplete-shared';
import {
  createElement as preactCreateElement,
  Fragment as PreactFragment,
  render,
} from 'preact';

import {
  createHighlightComponent,
  createReverseHighlightComponent,
  createReverseSnippetComponent,
  createSnippetComponent,
} from './components';
import {
  AutocompleteClassNames,
  AutocompleteComponents,
  AutocompleteOptions,
  AutocompleteRender,
  AutocompleteRenderer,
  AutocompleteTranslations,
} from './types';
import { getHTMLElement, mergeClassNames } from './utils';

const defaultClassNames: AutocompleteClassNames = {
  clearButton: 'aa-ClearButton',
  detachedCancelButton: 'aa-DetachedCancelButton',
  detachedContainer: 'aa-DetachedContainer',
  detachedFormContainer: 'aa-DetachedFormContainer',
  detachedOverlay: 'aa-DetachedOverlay',
  detachedSearchButton: 'aa-DetachedSearchButton',
  detachedSearchButtonIcon: 'aa-DetachedSearchButtonIcon',
  detachedSearchButtonPlaceholder: 'aa-DetachedSearchButtonPlaceholder',
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
  root: 'aa-Autocomplete',
  source: 'aa-Source',
  sourceFooter: 'aa-SourceFooter',
  sourceHeader: 'aa-SourceHeader',
  sourceNoResults: 'aa-SourceNoResults',
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
    renderNoResults,
    renderer,
    detachedMediaQuery,
    components,
    translations,
    ...core
  } = options;

  /* eslint-disable no-restricted-globals */
  const environment: AutocompleteEnvironment = (typeof window !== 'undefined'
    ? window
    : {}) as typeof window;
  /* eslint-enable no-restricted-globals */
  const containerElement = getHTMLElement(environment, container);

  invariant(
    containerElement.tagName !== 'INPUT',
    'The `container` option does not support `input` elements. You need to change the container to a `div`.'
  );

  const defaultedRenderer = renderer ?? defaultRenderer;
  const defaultComponents: AutocompleteComponents = {
    Highlight: createHighlightComponent(defaultedRenderer),
    ReverseHighlight: createReverseHighlightComponent(defaultedRenderer),
    ReverseSnippet: createReverseSnippetComponent(defaultedRenderer),
    Snippet: createSnippetComponent(defaultedRenderer),
  };
  const defaultTranslations: AutocompleteTranslations = {
    clearButtonTitle: 'Clear',
    detachedCancelButtonText: 'Cancel',
    submitButtonTitle: 'Submit',
  };

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
        ? getHTMLElement(environment, panelContainer)
        : environment.document.body,
      panelPlacement: panelPlacement ?? 'input-wrapper-width',
      render: render ?? defaultRender,
      renderNoResults,
      renderer: defaultedRenderer,
      detachedMediaQuery:
        detachedMediaQuery ??
        getComputedStyle(environment.document.documentElement).getPropertyValue(
          '--aa-detached-media-query'
        ),
      components: {
        ...defaultComponents,
        ...components,
      },
      translations: {
        ...defaultTranslations,
        ...translations,
      },
    },
    core: {
      ...core,
      id: core.id ?? generateAutocompleteId(),
      environment,
    },
  };
}
