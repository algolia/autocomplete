import { Component, WithClassNames } from '../types/Component';
import { concatClassNames, setProperties } from '../utils';

import { ResetIcon } from './ResetIcon';

type ResetButtonProps = WithClassNames<{}>;

export const ResetButton: Component<ResetButtonProps, HTMLButtonElement> = ({
  classNames,
}) => {
  const element = document.createElement('button');
  setProperties(element, {
    type: 'reset',
    class: concatClassNames(['aa-ResetButton', classNames.resetButton]),
  });

  element.appendChild(ResetIcon({}));

  return element;
};
