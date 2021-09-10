export type DefaultTagType = Record<string, unknown>;

export type BaseTag<TTag = DefaultTagType> = TTag & { label: string };

export type Tag<TTag = DefaultTagType> = BaseTag<TTag> & {
  remove: () => void;
};
