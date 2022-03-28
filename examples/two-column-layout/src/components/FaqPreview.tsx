/** @jsx h */
import { AutocompleteComponents } from '@algolia/autocomplete-js';
import { h } from 'preact';

import { FaqHit } from '../types';

import { Breadcrumb } from './Breadcrumb';

type FaqPreviewProps = {
  hit: FaqHit;
  components: AutocompleteComponents;
};

export function FaqPreview({ hit, components }: FaqPreviewProps) {
  return (
    <div className="aa-FaqPreview aa-Item">
      <div className="aa-ItemContent">
        <div className="aa-ItemContentBody">
          <h3>{hit.title}</h3>
          <Breadcrumb items={hit.list_categories} />

          <p className="aa-ItemContentDescription">
            <components.Snippet hit={hit} attribute="description" />
          </p>

          <h4>More questions?</h4>
          <a href="#">Please contact our support team here</a>
        </div>
      </div>
    </div>
  );
}
