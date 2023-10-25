import type {
  Execute,
  ExecuteResponse,
  RequesterDescription,
  TransformResponse,
} from '@algolia/autocomplete-preset-algolia';
import { decycle, flatten, invariant } from '@algolia/autocomplete-shared';
import type { SearchResponse } from '@algolia/autocomplete-shared';
import {
  MultipleQueriesQuery,
  SearchForFacetValuesResponse,
} from '@algolia/client-search';
import type { SearchClient } from 'algoliasearch/lite';

import {
  AutocompleteState,
  AutocompleteStore,
  BaseItem,
  InternalAutocompleteSource,
  OnResolveParams,
} from './types';
import { mapToAlgoliaResponse } from './utils';

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
  requesterId?: string;
  items: RequestDescriptionPreResolved<TItem>['requests'];
};

type RequestDescriptionPreResolved<TItem extends BaseItem> = Pick<
  RequesterDescription<TItem>,
  'execute' | 'requesterId' | 'searchClient' | 'transformResponse'
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
  sourceId: string,
  state: AutocompleteState<TItem>
):
  | RequestDescriptionPreResolved<TItem>
  | RequestDescriptionPreResolvedCustom<TItem> {
  if (isRequesterDescription<TItem>(itemsOrDescription)) {
    const contextParameters =
      itemsOrDescription.requesterId === 'algolia'
        ? Object.assign(
            {},
            ...Object.keys(state.context).map((key) => {
              return (state.context[key] as Record<string, unknown>)
                ?.__algoliaSearchParameters;
            })
          )
        : {};

    return {
      ...itemsOrDescription,
      requests: itemsOrDescription.queries.map((query) => ({
        query:
          itemsOrDescription.requesterId === 'algolia'
            ? {
                ...query,
                params: {
                  ...contextParameters,
                  ...query.params,
                },
              }
            : query,
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

    const { searchClient, execute, requesterId, requests } = current;

    const container = acc.find<PackedDescription<TItem>>(
      (item): item is PackedDescription<TItem> => {
        return (
          isDescription(current) &&
          isDescription(item) &&
          item.searchClient === searchClient &&
          Boolean(requesterId) &&
          item.requesterId === requesterId
        );
      }
    );

    if (container) {
      container.items.push(...requests);
    } else {
      const request: PackedDescription<TItem> = {
        execute,
        requesterId,
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

    const { execute, items, searchClient } =
      maybeDescription as PackedDescription<TItem>;

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
  sources: Array<InternalAutocompleteSource<TItem>>,
  store: AutocompleteStore<TItem>
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

    source.onResolve({
      source,
      results,
      items,
      state: store.getState(),
    } as OnResolveParams<TItem>);

    invariant(
      Array.isArray(items),
      () => `The \`getItems\` function from source "${
        source.sourceId
      }" must return an array of items but returned type ${JSON.stringify(
        typeof items
      )}:\n\n${JSON.stringify(decycle(items), null, 2)}.

See: https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/sources/#param-getitems`
    );

    invariant(
      (items as Array<typeof items>).every(Boolean),
      `The \`getItems\` function from source "${
        source.sourceId
      }" must return an array of items but returned ${JSON.stringify(
        undefined
      )}.

Did you forget to return items?

See: https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/sources/#param-getitems`
    );

    return {
      source,
      items,
    };
  });
}
