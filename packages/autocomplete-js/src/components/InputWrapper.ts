import { Component, WithClassNames } from '../types/Component';
import { concatClassNames, setProperties } from '../utils';

type InputWrapperProps = WithClassNames<{}>;

export const InputWrapper: Component<InputWrapperProps, HTMLDivElement> = ({
  classNames,
}) => {
  const element = document.createElement('div');
  setProperties(element, {
    class: concatClassNames(['aa-InputWrapper', classNames.inputWrapper]),
  });

  return element;
};
