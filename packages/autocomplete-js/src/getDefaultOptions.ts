import { AutocompleteEnvironment, BaseItem } from '@algolia/autocomplete-core';
import {
  generateAutocompleteId,
  invariant,
  warn,
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
  detachedSearchButtonQuery: 'aa-DetachedSearchButtonQuery',
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
  panelLayout: 'aa-PanelLayout aa-Panel--scrollable',
  root: 'aa-Autocomplete',
  source: 'aa-Source',
  sourceFooter: 'aa-SourceFooter',
  sourceHeader: 'aa-SourceHeader',
  sourceNoResults: 'aa-SourceNoResults',
  submitButton: 'aa-SubmitButton',
};

const defaultRender: AutocompleteRender<any> = ({ children, render }, root) => {
  render(children, root);
};

const defaultRenderer: Required<AutocompleteRenderer> = {
  createElement: preactCreateElement,
  Fragment: PreactFragment,
  render,
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
  const environment: AutocompleteEnvironment = (
    typeof window !== 'undefined' ? window : {}
  ) as typeof window;
  /* eslint-enable no-restricted-globals */
  const containerElement = getHTMLElement(environment, container);

  invariant(
    containerElement.tagName !== 'INPUT',
    'The `container` option does not support `input` elements. You need to change the container to a `div`.'
  );

  warn(
    !(render && renderer && !renderer?.render),
    `You provided the \`render\` option but did not provide a \`renderer.render\`. Since v1.6.0, you can provide a \`render\` function directly in \`renderer\`.` +
      `\nTo get rid of this warning, do any of the following depending on your use case.` +
      "\n- If you are using the `render` option only to override Autocomplete's default `render` function, pass the `render` function into `renderer` and remove the `render` option." +
      '\n- If you are using the `render` option to customize the layout, pass your `render` function into `renderer` and use it from the provided parameters of the `render` option.' +
      '\n- If you are using the `render` option to work with React 18, pass an empty `render` function into `renderer`.' +
      '\nSee https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-js/autocomplete/#param-render'
  );

  warn(
    !renderer ||
      render ||
      (renderer.Fragment && renderer.createElement && renderer.render),
    `You provided an incomplete \`renderer\` (missing: ${[
      !renderer?.createElement && '`renderer.createElement`',
      !renderer?.Fragment && '`renderer.Fragment`',
      !renderer?.render && '`renderer.render`',
    ]
      .filter(Boolean)
      .join(', ')}). This can cause rendering issues.` +
      '\nSee https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-js/autocomplete/#param-renderer'
  );

  const defaultedRenderer = { ...defaultRenderer, ...renderer };

  const defaultComponents: AutocompleteComponents = {
    Highlight: createHighlightComponent(defaultedRenderer),
    ReverseHighlight: createReverseHighlightComponent(defaultedRenderer),
    ReverseSnippet: createReverseSnippetComponent(defaultedRenderer),
    Snippet: createSnippetComponent(defaultedRenderer),
  };

  const defaultTranslations: AutocompleteTranslations = {
    clearButtonTitle: 'Clear',
    detachedCancelButtonText: 'Cancel',
    detachedSearchButtonTitle: 'Search',
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
        // @MAJOR Deal with registering components with the same name as the
        // default ones. We could disallow registering these components by
        // merging the default components second.
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
