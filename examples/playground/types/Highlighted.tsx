import { HighlightResult } from '@algolia/client-search';

export type Highlighted<TRecord> = TRecord & {
  _highlightResult: HighlightResult<TRecord>;
};
