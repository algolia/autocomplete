import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';

type SourceHeaderProps = WithClassNames<{}>;

export const SourceHeader: Component<SourceHeaderProps, HTMLDivElement> = ({
  classNames,
}) => {
  return Element<'div'>('div', {
    class: concatClassNames(['aa-SourceHeader', classNames.sourceHeader]),
  });
};
