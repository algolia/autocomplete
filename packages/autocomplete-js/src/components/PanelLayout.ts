import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';

type PanelLayoutProps = WithClassNames<{}>;

export const PanelLayout: Component<PanelLayoutProps, HTMLDivElement> = ({
  classNames,
  ...props
}) => {
  return Element<'div'>('div', {
    ...props,
    class: concatClassNames('aa-PanelLayout', classNames.panelLayout),
  });
};
