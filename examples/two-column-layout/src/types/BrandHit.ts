import { Hit } from '@algolia/client-search';

type BrandRecord = {
  label: string;
  count: number;
};

export type BrandHit = Hit<BrandRecord>;
