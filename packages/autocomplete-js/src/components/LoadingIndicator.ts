import { Component, WithClassNames } from '../types/Component';
import { concatClassNames, setProperties } from '../utils';

import { LoadingIcon } from './LoadingIcon';

type LoadingIndicatorProps = WithClassNames<{
  hidden: boolean;
}>;

export const LoadingIndicator: Component<
  LoadingIndicatorProps,
  HTMLDivElement
> = ({ classNames, ...props }) => {
  const element = document.createElement('div');
  setProperties(element, {
    class: concatClassNames([
      'aa-LoadingIndicator',
      classNames.loadingIndicator,
    ]),
    ...props,
  });

  element.appendChild(LoadingIcon({}));

  return element;
};
