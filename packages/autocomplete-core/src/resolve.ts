import { Description } from './createRequester';

function pack<TQuery, TResult, TItem>(
  items: Array<Description<TQuery, TResult>> | TItem[]
) {
  return items.reduce((acc, current) => {
    const { searchClient, fetcher, queries } = current;

    const index = acc.findIndex((item) => {
      return (
        searchClient &&
        fetcher &&
        item?.searchClient === searchClient &&
        item?.fetcher === fetcher
      );
    });

    if (!searchClient) {
      acc.push(current);
    } else if (index > -1) {
      acc[index].items.push(...queries);
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

export function resolve<TQuery, TResult, TItem>(
  items: Array<Description<TQuery, TResult>> | TItem[]
) {
  const packed = pack(items);

  return Promise.all(
    packed.map((description) => {
      if (!description.searchClient) {
        return Promise.resolve(description);
      }

      const { fetcher, searchClient, items } = description;

      return fetcher({
        searchClient,
        queries: items,
      });
    })
  );
}
