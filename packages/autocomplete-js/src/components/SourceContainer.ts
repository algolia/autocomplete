import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';

type SourceContainerProps = WithClassNames<{}>;

export const SourceContainer: Component<SourceContainerProps, HTMLElement> = ({
  classNames,
  ...props
}) => {
  return Element<'section'>('section', {
    ...props,
    class: concatClassNames('aa-Source', classNames.source),
  });
};
