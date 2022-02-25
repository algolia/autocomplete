import {
  useHierarchicalMenu,
  UseHierarchicalMenuProps,
} from 'react-instantsearch-hooks';

import { cx, isModifierClick } from '../utils';

export type HierarchicalMenuProps = React.ComponentProps<'div'> &
  UseHierarchicalMenuProps;

function HierarchicalList({
  items,
  refine,
  createURL,
}: Pick<
  ReturnType<typeof useHierarchicalMenu>,
  'items' | 'refine' | 'createURL'
>) {
  return (
    <ul className="ais-HierarchicalMenu-list">
      {items.map((item) => (
        <li
          key={item.value}
          className={cx(
            'ais-HierarchicalMenu-item',
            item.isRefined && 'ais-HierarchicalMenu-item--selected'
          )}
        >
          <a
            className="ais-HierarchicalMenu-link"
            href={createURL(item.value)}
            onClick={(event) => {
              if (isModifierClick(event)) {
                return;
              }
              event.preventDefault();
              refine(item.value);
            }}
          >
            <span className="ais-HierarchicalMenu-labelText">{item.label}</span>
            <span className="ais-HierarchicalMenu-count">{item.count}</span>
          </a>
          {Boolean(item.data) && (
            <HierarchicalList
              items={item.data!}
              refine={refine}
              createURL={createURL}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

export function HierarchicalMenu(props: HierarchicalMenuProps) {
  const {
    createURL,
    canToggleShowMore,
    isShowingMore,
    items,
    refine,
    toggleShowMore,
  } = useHierarchicalMenu(props);

  return (
    <div className={cx('ais-HierarchicalMenu', props.className)}>
      <HierarchicalList items={items} refine={refine} createURL={createURL} />
      {props.showMore && (
        <button
          className={cx(
            'ais-HierarchicalMenu-showMore',
            !canToggleShowMore && 'ais-HierarchicalMenu-showMore--disabled'
          )}
          disabled={!canToggleShowMore}
          onClick={toggleShowMore}
        >
          {isShowingMore ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}
