import React, { render } from 'preact/compat';

import { DocSearch, version } from '@docsearch/react';

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
    <DocSearch
      {...props}
      transformSearchClient={(searchClient) => {
        searchClient.addAlgoliaAgent(`docsearch.js (${version})`);

        return props.transformSearchClient
          ? props.transformSearchClient(searchClient)
          : searchClient;
      }}
    />,
    getHTMLElement(props.container, props.environment)
  );
}
