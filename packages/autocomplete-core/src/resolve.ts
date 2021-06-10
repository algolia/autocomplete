import type {
  Execute,
  ExecuteResponse,
  RequesterDescription,
  TransformResponse,
} from '@algolia/autocomplete-preset-algolia';
import { invariant } from '@algolia/autocomplete-shared';
import {
  MultipleQueriesQuery,
  SearchForFacetValuesResponse,
  SearchResponse,
} from '@algolia/client-search';
import type { SearchClient } from 'algoliasearch/lite';

import { BaseItem, InternalAutocompleteSource } from './types';
import { flatten, mapToAlgoliaResponse } from './utils';

function isDescription<TItem extends BaseItem>(
  item:
    | RequestDescriptionPreResolved<TItem>
    | RequestDescriptionPreResolvedCustom<TItem>
    | PackedDescription<TItem>
): item is RequestDescriptionPreResolved<TItem> {
  return Boolean((item as RequestDescriptionPreResolved<TItem>).execute);
}

function isRequesterDescription<TItem extends BaseItem>(
  description: TItem[] | TItem[][] | RequesterDescription<TItem>
): description is RequesterDescription<TItem> {
  return Boolean((description as RequesterDescription<TItem>)?.execute);
}

type PackedDescription<TItem extends BaseItem> = {
  searchClient: SearchClient;
  execute: Execute<TItem>;
  items: RequestDescriptionPreResolved<TItem>['requests'];
};

type RequestDescriptionPreResolved<TItem extends BaseItem> = Pick<
  RequesterDescription<TItem>,
  'execute' | 'searchClient' | 'transformResponse'
> & {
  requests: Array<{
    query: MultipleQueriesQuery;
    sourceId: string;
    transformResponse: TransformResponse<TItem>;
  }>;
};

type RequestDescriptionPreResolvedCustom<TItem extends BaseItem> = {
  items: TItem[] | TItem[][];
  sourceId: string;
  transformResponse?: undefined;
};

export function preResolve<TItem extends BaseItem>(
  itemsOrDescription: TItem[] | TItem[][] | RequesterDescription<TItem>,
  sourceId: string
):
  | RequestDescriptionPreResolved<TItem>
  | RequestDescriptionPreResolvedCustom<TItem> {
  if (isRequesterDescription<TItem>(itemsOrDescription)) {
    return {
      ...itemsOrDescription,
      requests: itemsOrDescription.queries.map((query) => ({
        query,
        sourceId,
        transformResponse: itemsOrDescription.transformResponse,
      })),
    };
  }

  return {
    items: itemsOrDescription,
    sourceId,
  };
}

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

    const { searchClient, execute, requests } = current;

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
      container.items.push(...requests);
    } else {
      const request: PackedDescription<TItem> = {
        execute,
        items: requests,
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
      requests: items,
    });
  });

  return Promise.all<
    RequestDescriptionPreResolvedCustom<TItem> | ExecuteResponse<TItem>
  >(values).then((responses) =>
    flatten<
      RequestDescriptionPreResolvedCustom<TItem> | ExecuteResponse<TItem>[0]
    >(responses)
  );
}

export function postResolve<TItem extends BaseItem>(
  responses: Array<
    RequestDescriptionPreResolvedCustom<TItem> | ExecuteResponse<TItem>[0]
  >,
  sources: Array<InternalAutocompleteSource<TItem>>
) {
  return sources.map((source) => {
    const matches = responses.filter(
      (response) => response.sourceId === source.sourceId
    );
    const results = matches.map(({ items }) => items);
    const transform = matches[0].transformResponse;
    const items = transform
      ? transform(
          mapToAlgoliaResponse(
            results as Array<
              SearchForFacetValuesResponse | SearchResponse<TItem>
            >
          )
        )
      : results;

    invariant(
      Array.isArray(items) && (items as Array<typeof items>).every(Boolean),
      `The \`getItems\` function from source "${
        source.sourceId
      }" must return an array of items but returned type ${JSON.stringify(
        typeof items
      )}:\n\n${JSON.stringify(items, null, 2)}`
    );

    return {
      source,
      items,
    };
  });
}
