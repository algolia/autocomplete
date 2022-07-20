import { HighlightResult } from '../types';

export type HighlightedHit<THit> = THit & {
  _highlightResult?: HighlightResult<THit>;
};
