import { SnippetResult } from '@algolia/client-search';

export type SnippetedHit<THit> = THit & {
  _snippetResult?: SnippetResult<THit>;
};
