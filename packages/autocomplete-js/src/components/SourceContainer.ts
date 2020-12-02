import { Component, WithClassNames } from '../types/Component';
import { concatClassNames, setProperties } from '../utils';

type SourceContainerProps = WithClassNames<{}>;

export const SourceContainer: Component<SourceContainerProps, HTMLElement> = ({
  classNames,
}) => {
  const element = document.createElement('section');
  setProperties(element, {
    class: concatClassNames(['aa-Source', classNames.source]),
  });

  return element;
};
