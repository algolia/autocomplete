import { Hit } from '@algolia/client-search';
import { snippetHit } from '@algolia/autocomplete-js';
import React from 'react';

type Product = {
  name: string;
  image: string;
  description: string;
};

type ProductHit = Hit<Product>;

type ProductItemProps = {
  hit: ProductHit;
};

export function AutocompleteProduct({ hit }: ProductItemProps) {
  return (
    <>
      <div className="aa-ItemIcon">
        <img src={hit.image} alt={hit.name} width="40" height="40" />
      </div>
      <div className="aa-ItemContent">
        <div className="aa-ItemContentTitle">
          {snippetHit<ProductHit>({ hit, attribute: 'name' })}
        </div>
        <div className="aa-ItemContentDescription">
          {snippetHit<ProductHit>({ hit, attribute: 'description' })}
        </div>
      </div>
      <button
        className="aa-ItemActionButton aa-TouchOnly aa-ActiveOnly"
        type="button"
        title="Select"
      >
        <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
          <path d="M18.984 6.984h2.016v6h-15.188l3.609 3.609-1.406 1.406-6-6 6-6 1.406 1.406-3.609 3.609h13.172v-4.031z"></path>
        </svg>
      </button>
    </>
  );
}
