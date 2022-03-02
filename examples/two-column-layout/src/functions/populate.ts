import { AutocompleteReshapeFunction } from './AutocompleteReshapeFunction';
import { normalizeReshapeSources } from './normalizeReshapeSources';

type PopulateOptions = {
  mainSourceId: string;
  limit: number;
};

export const populate: AutocompleteReshapeFunction<PopulateOptions> = ({
  mainSourceId,
  limit,
}) => {
  return function runUniqBy(...rawSources) {
    const originalSources = normalizeReshapeSources(rawSources);
    const otherSources = originalSources.filter(
      (s) => s.sourceId !== mainSourceId
    );

    let itemNb = 0;
    otherSources.forEach((source) => {
      itemNb += source.getItems().length;
    });

    return originalSources.map((source) => {
      let transformedSource = source;
      if (source.sourceId === mainSourceId) {
        transformedSource = {
          ...source,
          getItems() {
            return source.getItems().slice(0, Math.max(limit - itemNb, 0));
          },
        };
      }
      return transformedSource;
    });
  };
};
