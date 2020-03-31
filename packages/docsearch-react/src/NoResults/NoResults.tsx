import React from 'react';

interface NoResultsProps {
  query: string;
}

export function NoResults(props: NoResultsProps) {
  return <div className="DocSearch-NoResults">
    <div className="Docsearch-Hit-title">No results for “{props.query}“.</div>
    <div className="DocSearch-Label">Try another search or if you believe this query should lead to actual results, please let us know with a <a href="">GitHub issue</a>.</div>
  </div>;
}
