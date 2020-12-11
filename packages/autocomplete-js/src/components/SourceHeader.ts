import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';

type SourceHeaderProps = WithClassNames<{}>;

export const SourceHeader: Component<SourceHeaderProps, HTMLDivElement> = ({
  classNames,
  ...props
}) => {
  return Element<'div'>('div', {
    ...props,
    class: concatClassNames('aa-SourceHeader', classNames.sourceHeader),
  });
};
