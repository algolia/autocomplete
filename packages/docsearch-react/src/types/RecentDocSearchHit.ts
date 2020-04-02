import { DocSearchHit } from './DocSearchHit';

export type RecentDocSearchHit = Omit<
  DocSearchHit,
  '_highlightResult' | '_snippetResult'
>;
