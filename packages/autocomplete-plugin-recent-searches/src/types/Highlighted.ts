export type Highlighted<TItem> = TItem & {
  _highlightResult: {
    query: {
      value: string;
    };
  };
};
