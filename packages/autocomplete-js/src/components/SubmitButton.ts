import { Component, WithClassNames } from '../types/Component';
import { concatClassNames, setProperties } from '../utils';

import { SearchIcon } from './SearchIcon';

type SubmitButtonProps = WithClassNames<{
  hidden: boolean;
}>;

export const SubmitButton: Component<SubmitButtonProps, HTMLButtonElement> = ({
  classNames,
  ...props
}) => {
  const element = document.createElement('button');
  setProperties(element, {
    type: 'submit',
    class: concatClassNames(['aa-SubmitButton', classNames.submitButton]),
    ...props,
  });

  element.appendChild(SearchIcon({}));

  return element;
};
