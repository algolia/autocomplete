export type DefaultTagType = Record<string, unknown>;

export type BaseTag<TTag extends DefaultTagType = DefaultTagType> = TTag & {
  label: string;
};

export type Tag<TTag extends DefaultTagType = DefaultTagType> =
  BaseTag<TTag> & {
    remove: () => void;
  };
