import type { SearchClient } from 'algoliasearch/lite';

import {
  RequesterDescription,
  RequestParams,
  Fetcher,
} from './createRequester';
import { AlgoliaRequesterTransformedResponse } from './requesters';

type FetcherDescriptionAlgolia<THit> = RequestParams<THit> & {
  fetcher: Fetcher<never, never>;
};

type FetchDescriptionCustom<TItem> = {
  items: TItem[];
  __autocomplete_sourceId: string;
  __autocomplete_transformResponse: (response: any) => any[];
};

type PackedDescription<TItem> = {
  fetcher: Fetcher<never, never>;
  searchClient: SearchClient;
  items: TItem[];
};

function isFetcherDescription<THit>(
  description: any
): description is FetcherDescriptionAlgolia<THit> {
  return Boolean(description.fetcher);
}

function assertIsFetcherDescription<THit>(
  _description: any
): asserts _description is FetcherDescriptionAlgolia<THit> {}

function isRequesterDescription(
  description: any
): description is RequesterDescription<any> {
  return Boolean(description.fetcher);
}

function assertIsRequesterDescription(
  _description: any
): asserts _description is RequesterDescription<any> {}

function pack<TItem>(
  items: Array<FetcherDescriptionAlgolia<TItem> | FetchDescriptionCustom<TItem>>
) {
  return items.reduce<
    Array<PackedDescription<TItem> | FetchDescriptionCustom<TItem>>
  >((acc, current) => {
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
  }, []);
}

export function resolve<TItem>(
  items: Array<
    | {
        fetcher: any;
        searchClient: SearchClient;
        queries: any[];
      }
    | AlgoliaRequesterTransformedResponse<TItem>
  >
) {
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
