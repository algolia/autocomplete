export type Highlighted<TItem> = TItem & {
  _highlightResult: {
    label: {
      value: string;
    };
  };
};
