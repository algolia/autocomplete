import { SnippetResult } from '../types';

export type SnippetedHit<THit> = THit & {
  _snippetResult?: SnippetResult<THit>;
};
