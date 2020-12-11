import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';

type TouchOverlayProps = WithClassNames<{}>;

export const TouchOverlay: Component<TouchOverlayProps, HTMLDivElement> = ({
  classNames,
  ...props
}) => {
  return Element<'div'>('div', {
    ...props,
    class: concatClassNames('aa-TouchOverlay', classNames.touchOverlay),
  });
};
