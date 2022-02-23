import { usePagination, UsePaginationProps } from 'react-instantsearch-hooks';
import { cx, isModifierClick } from '../utils';

export type PaginationProps = React.ComponentProps<'div'> & UsePaginationProps;

export function Pagination(props: PaginationProps) {
  const {
    refine,
    createURL,
    pages,
    currentRefinement,
    isFirstPage,
    isLastPage,
    nbPages,
    canRefine,
  } = usePagination(props);

  return (
    <div
      className={cx(
        'ais-Pagination',
        canRefine === false && 'ais-Pagination--noRefinement',
        props.className
      )}
    >
      <ul className="ais-Pagination-list">
        <PaginationItem
          aria-label="First"
          value={0}
          isDisabled={isFirstPage}
          createURL={createURL}
          refine={refine}
          className={cx(
            'ais-Pagination-item',
            'ais-Pagination-item--firstPage'
          )}
        >
          ‹‹
        </PaginationItem>

        <PaginationItem
          aria-label="Previous"
          value={currentRefinement - 1}
          isDisabled={isFirstPage}
          createURL={createURL}
          refine={refine}
          className={cx(
            'ais-Pagination-item',
            'ais-Pagination-item--previousPage'
          )}
        >
          ‹
        </PaginationItem>

        {pages.map((page) => (
          <PaginationItem
            key={page}
            aria-label={String(page)}
            value={page}
            isDisabled={false}
            createURL={createURL}
            refine={refine}
            className={cx(
              'ais-Pagination-item',
              page === currentRefinement && 'ais-Pagination-item--selected'
            )}
          >
            {page + 1}
          </PaginationItem>
        ))}

        <PaginationItem
          aria-label="Next"
          value={currentRefinement + 1}
          isDisabled={isLastPage}
          createURL={createURL}
          refine={refine}
          className={cx('ais-Pagination-item', 'ais-Pagination-item--nextPage')}
        >
          ›
        </PaginationItem>

        <PaginationItem
          aria-label="Last"
          value={nbPages - 1}
          isDisabled={isLastPage}
          createURL={createURL}
          refine={refine}
          className={cx('ais-Pagination-item', 'ais-Pagination-item--lastPage')}
        >
          ››
        </PaginationItem>
      </ul>
    </div>
  );
}

type PaginationItemProps = React.ComponentProps<'a'> &
  Pick<ReturnType<typeof usePagination>, 'refine' | 'createURL'> & {
    isDisabled: boolean;
    value: number;
  };

function PaginationItem(props: PaginationItemProps) {
  const { isDisabled, className, href, value, createURL, refine, ...rest } =
    props;

  if (isDisabled) {
    return (
      <li className={cx(className, 'ais-Pagination-item--disabled')}>
        <span className="ais-Pagination-link" {...rest} />
      </li>
    );
  }

  return (
    <li className={className}>
      <a
        className="ais-Pagination-link"
        href={createURL(value)}
        onClick={(event) => {
          if (isModifierClick(event)) {
            return;
          }

          event.preventDefault();
          refine(value);
        }}
        {...rest}
      />
    </li>
  );
}
