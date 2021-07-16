/** @jsx createElement */
import {
  AutocompleteApi as AutocompleteCoreApi,
  AutocompleteScopeApi,
} from '@algolia/autocomplete-core';
import { BaseItem } from '@algolia/autocomplete-core/src';

import {
  AutocompleteClassNames,
  AutocompleteComponents,
  AutocompleteDom,
  AutocompletePropGetters,
  AutocompleteRender,
  AutocompleteState,
  Pragma,
  PragmaFrag,
} from './types';
import { setProperties, setPropertiesWithoutEvents } from './utils';

type RenderProps<TItem extends BaseItem> = {
  autocomplete: AutocompleteCoreApi<TItem>;
  autocompleteScopeApi: AutocompleteScopeApi<TItem>;
  classNames: AutocompleteClassNames;
  components: AutocompleteComponents;
  createElement: Pragma;
  dom: AutocompleteDom;
  Fragment: PragmaFrag;
  panelContainer: HTMLElement;
  propGetters: AutocompletePropGetters<TItem>;
  state: AutocompleteState<TItem>;
};

export function renderSearchBox<TItem extends BaseItem>({
  autocomplete,
  autocompleteScopeApi,
  dom,
  propGetters,
  state,
}: RenderProps<TItem>): void {
  setPropertiesWithoutEvents(
    dom.root,
    propGetters.getRootProps({
      state,
      props: autocomplete.getRootProps({}),
      ...autocompleteScopeApi,
    })
  );
  setPropertiesWithoutEvents(
    dom.input,
    propGetters.getInputProps({
      state,
      props: autocomplete.getInputProps({ inputElement: dom.input }),
      inputElement: dom.input,
      ...autocompleteScopeApi,
    })
  );
  setProperties(dom.label, { hidden: state.status === 'stalled' });
  setProperties(dom.loadingIndicator, { hidden: state.status !== 'stalled' });
  setProperties(dom.clearButton, { hidden: !state.query });
}

export function renderPanel<TItem extends BaseItem>(
  render: AutocompleteRender<TItem>,
  {
    autocomplete,
    autocompleteScopeApi,
    classNames,
    createElement,
    dom,
    Fragment,
    panelContainer,
    propGetters,
    state,
    components,
  }: RenderProps<TItem>
): void {
  if (!state.isOpen) {
    if (panelContainer.contains(dom.panel)) {
      panelContainer.removeChild(dom.panel);
    }

    return;
  }

  // We add the panel element to the DOM when it's not yet appended and that the
  // items are fetched.
  if (!panelContainer.contains(dom.panel) && state.status !== 'loading') {
    panelContainer.appendChild(dom.panel);
  }

  dom.panel.classList.toggle('aa-Panel--stalled', state.status === 'stalled');

  const sections = state.collections
    .filter(
      ({ source, items }) => source.templates.noResults || items.length > 0
    )
    .map(({ source, items }, sourceIndex) => (
      <section
        key={sourceIndex}
        className={classNames.source}
        data-autocomplete-source-id={source.sourceId}
      >
        {source.templates.header && (
          <div className={classNames.sourceHeader}>
            {source.templates.header({
              components,
              createElement,
              Fragment,
              items,
              source,
              state,
            })}
          </div>
        )}

        {source.templates.noResults && items.length === 0 ? (
          <div className={classNames.sourceNoResults}>
            {source.templates.noResults({
              components,
              createElement,
              Fragment,
              source,
              state,
            })}
          </div>
        ) : (
          <ul
            className={classNames.list}
            {...propGetters.getListProps({
              state,
              props: autocomplete.getListProps({}),
              ...autocompleteScopeApi,
            })}
          >
            {items.map((item) => {
              const itemProps = autocomplete.getItemProps({
                item,
                source,
              });

              return (
                <li
                  key={itemProps.id}
                  className={classNames.item}
                  {...propGetters.getItemProps({
                    state,
                    props: itemProps,
                    ...autocompleteScopeApi,
                  })}
                >
                  {source.templates.item({
                    components,
                    createElement,
                    Fragment,
                    item,
                    state,
                  })}
                </li>
              );
            })}
          </ul>
        )}

        {source.templates.footer && (
          <div className={classNames.sourceFooter}>
            {source.templates.footer({
              components,
              createElement,
              Fragment,
              items,
              source,
              state,
            })}
          </div>
        )}
      </section>
    ));

  const children = (
    <Fragment>
      <div className={classNames.panelLayout + ' aa-Panel--scrollable'}>{sections}</div>
      <div className="aa-GradientBottom" />
    </Fragment>
  );
  const elements = sections.reduce((acc, current) => {
    acc[current.props['data-autocomplete-source-id']] = current;
    return acc;
  }, {});

  render(
    {
      children,
      state,
      sections,
      elements,
      createElement,
      Fragment,
      components,
      ...autocompleteScopeApi,
    },
    dom.panel
  );
}
