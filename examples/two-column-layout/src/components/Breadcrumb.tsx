/** @jsx h */
import { h } from 'preact';

import { intersperse } from '../utils/intersperse';

import { ChevronRightIcon } from './Icons';

type BreadcrumbProps = {
  items: string[];
};

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div className="aa-Breadcrumb">
      {intersperse(
        items,
        <div className="aa-ItemIcon aa-ItemIcon--noBorder aa-FavoriteIcon">
          <ChevronRightIcon />
        </div>
      )}
    </div>
  );
};
