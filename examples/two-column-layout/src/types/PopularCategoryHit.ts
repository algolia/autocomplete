import { Hit } from '@algolia/client-search';

type PopularCategoryRecord = {
  label: string;
  count: number;
};

export type PopularCategoryHit = Hit<PopularCategoryRecord>;
