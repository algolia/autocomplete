import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';
import { SearchIcon } from './SearchIcon';

type TouchSearchButtonIconProps = WithClassNames<{}>;

export const TouchSearchButtonIcon: Component<
  TouchSearchButtonIconProps,
  HTMLDivElement
> = ({ classNames, ...props }) => {
  return Element<'div'>('div', {
    ...props,
    class: concatClassNames(
      'aa-TouchSearchButtonIcon',
      classNames.touchSearchButtonIcon
    ),
    children: [SearchIcon({})],
  });
};
