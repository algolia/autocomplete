import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';
import { LoadingIcon } from './LoadingIcon';

type LoadingIndicatorProps = WithClassNames<{}>;

export const LoadingIndicator: Component<
  LoadingIndicatorProps,
  HTMLDivElement
> = ({ classNames, children = [], ...props }) => {
  return Element<'div'>('div', {
    class: concatClassNames('aa-LoadingIndicator', classNames.loadingIndicator),
    ...props,
    children: [LoadingIcon({}), ...children],
  });
};
