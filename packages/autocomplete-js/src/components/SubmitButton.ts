import { Component, WithClassNames } from '../types/Component';
import { concatClassNames, setProperties } from '../utils';

import { SearchIcon } from './SearchIcon';

type SubmitButtonProps = WithClassNames<{}>;

export const SubmitButton: Component<SubmitButtonProps, HTMLButtonElement> = ({
  classNames,
}) => {
  const element = document.createElement('button');
  setProperties(element, {
    type: 'submit',
    class: concatClassNames(['aa-SubmitButton', classNames.submitButton]),
  });

  element.appendChild(SearchIcon({}));

  return element;
};
