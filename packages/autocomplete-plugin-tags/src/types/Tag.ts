export type BaseTag<TTag = Record<string, unknown>> = TTag & { label: string };

export type Tag<TTag = Record<string, unknown>> = BaseTag<TTag> & {
  remove: () => void;
};
