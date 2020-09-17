export type ParseAlgoliaHitParams<TItem> = {
  hit: TItem;
  attribute: keyof TItem;
  ignoreEscape?: string[];
};
