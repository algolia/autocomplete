import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';

type SourceFooterProps = WithClassNames<{}>;

export const SourceFooter: Component<SourceFooterProps, HTMLDivElement> = ({
  classNames,
}) => {
  return Element<'div'>('div', {
    class: concatClassNames(['aa-SourceFooter', classNames.sourceFooter]),
  });
};
