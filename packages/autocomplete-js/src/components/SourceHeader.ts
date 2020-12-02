import { Component, WithClassNames } from '../types/Component';
import { concatClassNames, setProperties } from '../utils';

type SourceHeaderProps = WithClassNames<{}>;

export const SourceHeader: Component<SourceHeaderProps, HTMLDivElement> = ({
  classNames,
}) => {
  const element = document.createElement('div');
  setProperties(element, {
    class: concatClassNames(['aa-SourceHeader', classNames.sourceHeader]),
  });

  return element;
};
