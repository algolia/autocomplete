import {
  AutocompleteScopeApi,
  AutocompleteOptions as AutocompleteCoreOptions,
  BaseItem,
  GetSourcesParams,
} from '@algolia/autocomplete-core';
import { MaybePromise } from '@algolia/autocomplete-shared';

import { AutocompleteClassNames } from './AutocompleteClassNames';
import { AutocompletePlugin } from './AutocompletePlugin';
import { AutocompletePropGetters } from './AutocompletePropGetters';
import { AutocompleteRender } from './AutocompleteRender';
import { AutocompleteRenderer } from './AutocompleteRenderer';
import { AutocompleteSource } from './AutocompleteSource';
import { AutocompleteState } from './AutocompleteState';

export interface OnStateChangeProps<TItem extends BaseItem>
  extends AutocompleteScopeApi<TItem> {
  state: AutocompleteState<TItem>;
  prevState: AutocompleteState<TItem>;
}

export interface AutocompleteOptions<TItem extends BaseItem>
  extends AutocompleteCoreOptions<TItem>,
    Partial<AutocompletePropGetters<TItem>> {
  /**
   * The container for the Autocomplete search box.
   *
   * You can either pass a [CSS selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/docs/Web/API/HTMLElement). The first element matching the provided selector will be used as container.
   */
  container: string | HTMLElement;
  /**
   * The container for the Autocomplete panel.
   *
   * You can either pass a [CSS selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/docs/Web/API/HTMLElement). The first element matching the provided selector will be used as container.
   *
   * @default document.body
   */
  panelContainer?: string | HTMLElement;
  /**
   * The Media Query to turn Autocomplete into a detached experience.
   *
   * @default "(hover: none) and (pointer: coarse)"
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries
   */
  detachedMediaQuery?: string;
  getSources?: (
    params: GetSourcesParams<TItem>
  ) => MaybePromise<Array<AutocompleteSource<TItem>>>;
  /**
   * The panel horizontal position.
   *
   * @default "input-wrapper-width"
   */
  panelPlacement?: 'start' | 'end' | 'full-width' | 'input-wrapper-width';
  /**
   * The class names to inject in each created DOM element.
   *
   * It it useful to design with external CSS frameworks.
   */
  classNames?: Partial<AutocompleteClassNames>;
  /**
   * Function called to render the autocomplete panel.
   * It is useful for rendering sections in different row or column layouts.
   * The default implementation appends all the sections to the root.
   */
  render?: AutocompleteRender<TItem>;
  renderEmpty?: AutocompleteRender<TItem>;
  initialState?: Partial<AutocompleteState<TItem>>;
  onStateChange?(props: OnStateChangeProps<TItem>): void;
  /**
   * Custom renderer.
   */
  renderer?: AutocompleteRenderer;
  plugins?: Array<AutocompletePlugin<TItem, unknown>>;
}
