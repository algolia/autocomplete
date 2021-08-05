export type BaseTag<TTag = Record<string, unknown>> = TTag & { label: string };

export type Tag<TTag> = BaseTag<TTag> & { remove: () => void };
