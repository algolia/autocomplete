import { Component } from '../types/Component';

export const LoadingIcon: Component<{}, SVGSVGElement> = () => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  element.setAttribute('class', 'aa-LoadingIcon');
  element.setAttribute('viewBox', '0 0 100 100');
  element.setAttribute('width', '20');
  element.setAttribute('height', '20');

  element.innerHTML = `<circle
  cx="50"
  cy="50"
  fill="none"
  r="35"
  stroke="currentColor"
  stroke-dasharray="164.93361431346415 56.97787143782138"
  stroke-width="4"
>
  <animateTransform
    attributeName="transform"
    type="rotate"
    repeatCount="indefinite"
    dur="1s"
    values="0 50 50;90 50 50;180 50 50;360 50 50"
    keyTimes="0;0.40;0.65;1"
  />
</circle>`;

  return element;
};
