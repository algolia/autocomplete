import type { SearchClient } from 'algoliasearch/lite';

import { Execute, InternalFetcherResponse } from './createRequester';
import {
  RequestDescriptionPreResolved,
  RequestDescriptionPreResolvedCustom,
} from './onInput';
import { BaseItem } from './types';

function isDescription<TItem extends BaseItem>(
  item:
    | RequestDescriptionPreResolved<TItem>
    | RequestDescriptionPreResolvedCustom<TItem>
    | PackedDescription<TItem>
): item is RequestDescriptionPreResolved<TItem> {
  return Boolean((item as RequestDescriptionPreResolved<TItem>).execute);
}

type PackedDescription<TItem extends BaseItem> = {
  searchClient: SearchClient;
  execute: Execute<TItem>;
  items: RequestDescriptionPreResolved<TItem>['queries'];
};

export function resolve<TItem extends BaseItem>(
  items: Array<
    | RequestDescriptionPreResolved<TItem>
    | RequestDescriptionPreResolvedCustom<TItem>
  >
) {
  const packed = items.reduce<
    Array<RequestDescriptionPreResolvedCustom<TItem> | PackedDescription<TItem>>
  >((acc, current) => {
    if (!isDescription(current)) {
      acc.push(current);
      return acc;
    }

    const { searchClient, execute, queries } = current;

    const container = acc.find<PackedDescription<TItem>>(
      (item): item is PackedDescription<TItem> => {
        return (
          isDescription(current) &&
          isDescription(item) &&
          item.searchClient === searchClient &&
          item.execute === execute
        );
      }
    );

    if (container) {
      container.items.push(...queries);
    } else {
      const request: PackedDescription<TItem> = {
        execute,
        items: queries,
        searchClient,
      };
      acc.push(request);
    }

    return acc;
  }, []);

  const values = packed.map<
    | Promise<RequestDescriptionPreResolvedCustom<TItem>>
    | ReturnType<Execute<TItem>>
  >((maybeDescription) => {
    if (!isDescription<TItem>(maybeDescription)) {
      return Promise.resolve(
        maybeDescription as RequestDescriptionPreResolvedCustom<TItem>
      );
    }

    const {
      execute,
      items,
      searchClient,
    } = maybeDescription as PackedDescription<TItem>;

    return execute({
      searchClient,
      queries: items,
    });
  });

  return Promise.all<
    RequestDescriptionPreResolvedCustom<TItem> | InternalFetcherResponse<TItem>
  >(values);
}
