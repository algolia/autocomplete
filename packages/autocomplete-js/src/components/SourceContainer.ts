import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';

type SourceContainerProps = WithClassNames<{}>;

export const SourceContainer: Component<SourceContainerProps, HTMLElement> = ({
  classNames,
}) => {
  return Element<'section'>('section', {
    class: concatClassNames(['aa-Source', classNames.source]),
  });
};
