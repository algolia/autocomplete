/** @jsx h */
import { h } from 'preact';

import { ChevronRightIcon } from './Icons';

type BreadcrumbProps = {
  items: string[];
};

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div className="aa-Breadcrumb">
      {items.reduce(
        (prev, curr, i, arr) =>
          i === arr.length - 1
            ? prev.concat(curr)
            : prev.concat([curr, <ChevronRightIcon key={prev + curr} />]),
        []
      )}
    </div>
  );
};
