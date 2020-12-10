import { BaseItem } from '@algolia/autocomplete-core';

import { defaultRenderer } from './defaultRenderer';
import { AutocompleteOptions } from './types';

export function getDefaultOptions<TItem extends BaseItem>(
  options: AutocompleteOptions<TItem>
) {
  const {
    container,
    panelContainer,
    render,
    panelPlacement,
    classNames,
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
    container,
    panelContainer: panelContainer ?? document.body,
    render: render ?? defaultRenderer,
    panelPlacement: panelPlacement ?? 'input-wrapper-width',
    classNames: classNames ?? {},
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
