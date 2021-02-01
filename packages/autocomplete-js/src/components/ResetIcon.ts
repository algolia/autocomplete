import { Component } from '../types/Component';

export const ResetIcon: Component<{}, SVGSVGElement> = () => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  element.setAttribute('class', 'aa-ResetIcon');
  element.setAttribute('viewBox', '0 0 20 20');
  element.setAttribute('width', '20');
  element.setAttribute('height', '20');
  element.setAttribute('fill', 'currentColor');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute(
    'd',
    'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
  );
  path.setAttribute('fill-rule', 'evenodd');
  path.setAttribute('clip-rule', 'evenodd');

  element.appendChild(path);

  return element;
};
