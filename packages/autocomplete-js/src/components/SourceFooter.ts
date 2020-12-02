import { Component, WithClassNames } from '../types/Component';
import { concatClassNames, setProperties } from '../utils';

type SourceFooterProps = WithClassNames<{}>;

export const SourceFooter: Component<SourceFooterProps, HTMLDivElement> = ({
  classNames,
}) => {
  const element = document.createElement('div');
  setProperties(element, {
    class: concatClassNames(['aa-SourceFooter', classNames.sourceFooter]),
  });

  return element;
};
