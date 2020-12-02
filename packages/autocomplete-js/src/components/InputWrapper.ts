import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';

type InputWrapperProps = WithClassNames<{}>;

export const InputWrapper: Component<InputWrapperProps, HTMLDivElement> = ({
  classNames,
}) => {
  return Element<'div'>('div', {
    class: concatClassNames(['aa-InputWrapper', classNames.inputWrapper]),
  });
};
