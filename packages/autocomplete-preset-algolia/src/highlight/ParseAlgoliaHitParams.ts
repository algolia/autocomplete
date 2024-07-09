export type ParseAlgoliaHitParams<TItem> = {
  hit: TItem;
  attribute: keyof TItem | Array<string | number>;
};
