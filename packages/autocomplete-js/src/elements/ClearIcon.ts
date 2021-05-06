import { AutocompleteEnvironment } from '@algolia/autocomplete-core';

import { AutocompleteElement } from '../types/AutocompleteElement';

export const ClearIcon: AutocompleteElement<
  { environment: AutocompleteEnvironment },
  SVGSVGElement
> = ({ environment }) => {
  const element = environment.document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg'
  );
  element.setAttribute('class', 'aa-ClearIcon');
  element.setAttribute('viewBox', '0 0 24 24');
  element.setAttribute('width', '18');
  element.setAttribute('height', '18');
  element.setAttribute('fill', 'currentColor');

  const path = environment.document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  );
  path.setAttribute(
    'd',
    'M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z'
  );

  element.appendChild(path);

  return element;
};
