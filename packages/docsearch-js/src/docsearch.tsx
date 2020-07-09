import React, { render } from 'preact/compat';

import { DocSearch } from '@docsearch/react';

function getHTMLElement(
  value: string | HTMLElement,
  environment: typeof window = window
): HTMLElement {
  if (typeof value === 'string') {
    return environment.document.querySelector<HTMLElement>(value)!;
  }

  return value;
}

export function docsearch(props) {
  render(
    <DocSearch {...props} />,
    getHTMLElement(props.container, props.environment)
  );
}
