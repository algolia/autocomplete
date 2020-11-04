// @TODO: reuse MaybePromise from autocomplete-core when we find a way to share the type
export type MaybePromise<TResolution> = Promise<TResolution> | TResolution;
