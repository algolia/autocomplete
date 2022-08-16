import { Hit } from '@algolia/client-search';

type PopularRecord = {
  query: string;
};

export type PopularHit = Hit<PopularRecord>;
