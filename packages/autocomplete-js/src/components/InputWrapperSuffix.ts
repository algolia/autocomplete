import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';

type InputWrapperSuffixProps = WithClassNames<{}>;

export const InputWrapperSuffix: Component<
  InputWrapperSuffixProps,
  HTMLDivElement
> = ({ classNames, ...props }) => {
  return Element<'div'>('div', {
    ...props,
    class: concatClassNames(
      'aa-InputWrapperSuffix',
      classNames.inputWrapperSuffix
    ),
  });
};
