export type HighlightHitParams<THit> = {
  hit: THit;
  attribute: keyof THit | string[];
  tagName?: string;
};
