import type { SearchClient } from 'algoliasearch/lite';

import { Fetcher } from './createFetcher';
import { RequesterDescription } from './types/RequesterDescription';
import {
  assertIsRequesterDescription,
  isRequesterDescription,
} from './utils/isRequesterDescription';

type FetcherDescription<TItem> = {
  searchClient: SearchClient;
  fetcher: Fetcher<any, any, any, any>;
  items: TItem[];
};

function isFetcherDescription(
  description: any
): description is FetcherDescription<any> {
  return Boolean(description.fetcher);
}

function assertIsFetcherDescription(
  _description: any
): asserts _description is FetcherDescription<any> {}

function pack<TItem>(items: Array<FetcherDescription<TItem> | TItem>) {
  return items.reduce<Array<TItem | FetcherDescription<TItem>>>(
    (acc, current) => {
      if (!isRequesterDescription(current)) {
        acc.push(current);
        return acc;
      }

      assertIsRequesterDescription(current);

      const { searchClient, fetcher, queries } = current;

      const index = acc.findIndex((item) => {
        return (
          isFetcherDescription(current) &&
          isFetcherDescription(item) &&
          item.searchClient === searchClient &&
          item.fetcher === fetcher
        );
      });

      const container = acc[index];
      assertIsFetcherDescription(container);

      if (index > -1) {
        container.items.push(...queries);
      } else {
        acc.push({
          searchClient,
          fetcher,
          items: searchClient ? queries : [current],
        });
      }

      return acc;
    },
    []
  );
}

export function resolve<TQuery, TResult, TItem>(
  items: Array<RequesterDescription<TQuery, TResult> | TItem>
): Promise<TItem[][]> {
  const packed = pack(items);

  return Promise.all(
    packed.map((maybeDescription) => {
      if (!isFetcherDescription(maybeDescription)) {
        return Promise.resolve([maybeDescription]);
      }

      const { fetcher, searchClient, items } = maybeDescription;

      return fetcher({
        searchClient,
        queries: items,
      });
    })
  );
}