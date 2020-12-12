import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';

type InputWrapperPrefixProps = WithClassNames<{}>;

export const InputWrapperPrefix: Component<
  InputWrapperPrefixProps,
  HTMLDivElement
> = ({ classNames, ...props }) => {
  return Element<'div'>('div', {
    ...props,
    class: concatClassNames(
      'aa-InputWrapperPrefix',
      classNames.inputWrapperPrefix
    ),
  });
};
