import { DocSearchHit } from './DocSearchHit';

export type InternalDocSearchHit = DocSearchHit & {
  __docsearch_parent: null | DocSearchHit;
};
