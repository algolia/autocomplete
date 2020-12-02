import { Component } from '../types/Component';

export const ResetIcon: Component<{}, SVGSVGElement> = () => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  element.setAttribute('class', 'aa-ResetIcon');
  element.setAttribute('viewBox', '0 0 20 20');
  element.setAttribute('width', '20');
  element.setAttribute('height', '20');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute(
    'd',
    'M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z'
  );
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('fill', 'none');
  path.setAttribute('fill-rule', 'evenodd');
  path.setAttribute('stroke-width', '1.4');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');

  element.appendChild(path);

  return element;
};
