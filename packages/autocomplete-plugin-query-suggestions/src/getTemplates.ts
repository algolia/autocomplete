import { reverseHighlightHit, SourceTemplates } from '@algolia/autocomplete-js';

import { searchIcon, tapAheadIcon } from './icons';
import { QuerySuggestionsHit } from './types';

export type GetTemplatesParams<TItem extends QuerySuggestionsHit> = {
  onTapAhead(item: TItem): void;
};

export function getTemplates<TItem extends QuerySuggestionsHit>({
  onTapAhead,
}: GetTemplatesParams<TItem>): SourceTemplates<TItem>['templates'] {
  return {
    item({ item, root }) {
      const content = document.createElement('div');
      content.className = 'aa-ItemContent';
      const icon = document.createElement('div');
      icon.className = 'aa-ItemSourceIcon';
      icon.innerHTML = searchIcon;
      const title = document.createElement('div');
      title.className = 'aa-ItemTitle';
      title.innerHTML = reverseHighlightHit<QuerySuggestionsHit>({
        hit: item,
        attribute: 'query',
      });
      content.appendChild(icon);
      content.appendChild(title);

      const tapAheadButton = document.createElement('button');
      tapAheadButton.className = 'aa-ItemActionButton';
      tapAheadButton.type = 'button';
      tapAheadButton.innerHTML = tapAheadIcon;
      tapAheadButton.title = `Fill query with "${item.query}"`;
      tapAheadButton.addEventListener('click', (event) => {
        event.stopPropagation();
        onTapAhead(item);
      });

      root.appendChild(content);
      root.appendChild(tapAheadButton);
    },
  };
}
