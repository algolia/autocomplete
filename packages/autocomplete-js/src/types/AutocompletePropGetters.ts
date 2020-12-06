import {
  BaseItem,
  AutocompleteApi as AutocompleteCoreApi,
} from '@algolia/autocomplete-core';

import { AutocompleteState } from './AutocompleteState';

export type AutocompletePropGetters<TItem extends BaseItem> = {
  getEnvironmentProps(params: {
    state: AutocompleteState<TItem>;
    props: ReturnType<AutocompleteCoreApi<TItem>['getEnvironmentProps']>;
  }): ReturnType<AutocompleteCoreApi<TItem>['getEnvironmentProps']>;
  getFormProps(params: {
    state: AutocompleteState<TItem>;
    props: ReturnType<AutocompleteCoreApi<TItem>['getFormProps']>;
  }): ReturnType<AutocompleteCoreApi<TItem>['getFormProps']>;
  getInputProps(params: {
    state: AutocompleteState<TItem>;
    props: ReturnType<AutocompleteCoreApi<TItem>['getInputProps']>;
    inputElement: HTMLInputElement;
  }): ReturnType<AutocompleteCoreApi<TItem>['getInputProps']>;
  getItemProps(params: {
    state: AutocompleteState<TItem>;
    props: ReturnType<AutocompleteCoreApi<TItem>['getItemProps']>;
  }): ReturnType<AutocompleteCoreApi<TItem>['getItemProps']>;
  getLabelProps(params: {
    state: AutocompleteState<TItem>;
    props: ReturnType<AutocompleteCoreApi<TItem>['getLabelProps']>;
  }): ReturnType<AutocompleteCoreApi<TItem>['getLabelProps']>;
  getListProps(params: {
    state: AutocompleteState<TItem>;
    props: ReturnType<AutocompleteCoreApi<TItem>['getListProps']>;
  }): ReturnType<AutocompleteCoreApi<TItem>['getListProps']>;
  getPanelProps(params: {
    state: AutocompleteState<TItem>;
    props: ReturnType<AutocompleteCoreApi<TItem>['getPanelProps']>;
  }): ReturnType<AutocompleteCoreApi<TItem>['getPanelProps']>;
  getRootProps(params: {
    state: AutocompleteState<TItem>;
    props: ReturnType<AutocompleteCoreApi<TItem>['getRootProps']>;
  }): ReturnType<AutocompleteCoreApi<TItem>['getRootProps']>;
};
