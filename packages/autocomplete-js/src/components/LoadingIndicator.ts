import { Component, WithClassNames } from '../types/Component';
import { concatClassNames, setProperties } from '../utils';

import { LoadingIcon } from './LoadingIcon';

type LoadingIndicatorProps = WithClassNames<{}>;

export const LoadingIndicator: Component<
  LoadingIndicatorProps,
  HTMLDivElement
> = ({ classNames }) => {
  const element = document.createElement('div');
  setProperties(element, {
    class: concatClassNames([
      'aa-LoadingIndicator',
      classNames.loadingIndicator,
    ]),
  });

  element.appendChild(LoadingIcon({}));

  return element;
};
