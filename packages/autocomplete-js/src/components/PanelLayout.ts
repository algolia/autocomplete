import { Component, WithClassNames } from '../types/Component';
import { concatClassNames, setProperties } from '../utils';

type PanelLayoutProps = WithClassNames<{}>;

export const PanelLayout: Component<PanelLayoutProps, HTMLDivElement> = ({
  classNames,
  ...props
}) => {
  const element = document.createElement('div');
  setProperties(element, {
    ...props,
    class: concatClassNames(['aa-PanelLayout', classNames.panelLayout]),
  });

  return element;
};
