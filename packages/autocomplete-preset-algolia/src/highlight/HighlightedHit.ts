import { HighlightResult } from '@algolia/client-search';

export type HighlightedHit<THit> = THit & {
  _highlightResult?: HighlightResult<THit>;
};
