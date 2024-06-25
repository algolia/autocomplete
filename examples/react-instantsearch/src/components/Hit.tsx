import type { Hit as AlgoliaHit } from 'instantsearch.js/es/types';

import { Snippet } from 'react-instantsearch';

type HitProps = {
  hit: AlgoliaHit<{
    name: string;
    image: string;
    brand: string;
    categories: string[];
  }>;
};

export function Hit({ hit }: HitProps) {
  return (
    <article className="hit">
      <div className="hit-image">
        <img src={hit.image} alt={hit.name} />
      </div>
      <div>
        <h1>
          <Snippet hit={hit} attribute="name" />
        </h1>
        <div>
          By <strong>{hit.brand}</strong> in{' '}
          <strong>{hit.categories[0]}</strong>
        </div>
      </div>
    </article>
  );
}
