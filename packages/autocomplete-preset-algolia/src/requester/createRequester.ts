import type {
  Fetcher,
  ExecuteParams,
  RequesterParams,
  RequestParams,
  RequesterDescription,
} from '../types';

export function createRequester(fetcher: Fetcher, requesterId?: string) {
  function execute<THit>(fetcherParams: ExecuteParams<THit>) {
    return fetcher<THit>({
      searchClient: fetcherParams.searchClient,
      queries: fetcherParams.requests.map((x) => x.query),
    }).then((responses) =>
      responses.map((response, index) => {
        const { sourceId, transformResponse } = fetcherParams.requests[index];

        return {
          items: response,
          sourceId,
          transformResponse,
        };
      })
    );
  }

  return function createSpecifiedRequester(
    requesterParams: RequesterParams<any>
  ) {
    return function requester<TTHit>(
      requestParams: RequestParams<TTHit>
    ): RequesterDescription<TTHit> {
      return {
        requesterId,
        execute,
        ...requesterParams,
        ...requestParams,
      };
    };
  };
}
