import type { Hit } from '@algolia/client-search';

type ProductRecord = {
  name: string;
  brand: string;
  image_urls: string[];
  image_blurred: string;
  price: {
    currency: string;
    discount_level: number;
    discounted_value: number;
    on_sales: boolean;
    value: number;
  };
  reviews: {
    count: number;
    rating: number;
  };
};

export type ProductHit = Hit<ProductRecord>;
