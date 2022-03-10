import { AutocompleteReshapeFunction } from './AutocompleteReshapeFunction';
import { normalizeReshapeSources } from './normalizeReshapeSources';

type PopulateOptions = {
  mainSourceId: string;
  limit: number;
};

// This reshape function computes the total number of source items and
// limits the provided main source number of items until it reaches the provided limit.
export const populate: AutocompleteReshapeFunction<PopulateOptions> = ({
  mainSourceId,
  limit,
}) => {
  return function runUniqBy(...rawSources) {
    const originalSources = normalizeReshapeSources(rawSources);
    const otherSources = originalSources.filter(
      (s) => s.sourceId !== mainSourceId
    );

    // Compute the total number of items per source.
    let totalItemNb = 0;
    otherSources.forEach((source) => {
      totalItemNb += source.getItems().length;
    });

    return originalSources.map((source) => {
      let transformedSource = source;

      // Limit the main source items length based on the provided limit and
      // the computed total number of items.
      if (source.sourceId === mainSourceId) {
        transformedSource = {
          ...source,
          getItems() {
            return source.getItems().slice(0, Math.max(limit - totalItemNb, 0));
          },
        };
      }
      return transformedSource;
    });
  };
};
