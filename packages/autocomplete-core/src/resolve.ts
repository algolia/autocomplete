import { Description } from './createRequester';

function pack<TQuery, TResult, TItem>(
  items: Array<Description<TQuery, TResult>> | TItem[]
) {
  return items.reduce((acc, curr) => {
    const index = acc.findIndex((item) => {
      return curr.searchClient && item?.searchClient === curr.searchClient;
    });

    if (!curr.searchClient) {
      acc.push(curr);
    } else if (index > -1) {
      acc[index].items.push(...curr.queries);
    } else {
      const { searchClient, fetcher, transformResponse } = curr;

      acc.push({
        searchClient,
        fetcher,
        transformResponse,
        items: curr.searchClient ? curr.queries : [curr],
      });
    }

    return acc;
  }, []);
}

export function resolve<TQuery, TResult, TItem>(
  items: Array<Description<TQuery, TResult>> | TItem[]
) {
  const packed = pack(items);

  return Promise.all(
    packed.map((description) => {
      if (!description.searchClient) {
        return Promise.resolve(description);
      }

      const {
        fetcher,
        searchClient,
        items,
        transformResponse, // @TODO: get from __autocomplete_transformResponse ?
      } = description;

      return fetcher({
        searchClient,
        queries: items,
      }).then((responses) => {
        return responses.map((response) => {
          return {
            ...response,
            transformResponse,
          };
        });
      });
    })
  );
}
