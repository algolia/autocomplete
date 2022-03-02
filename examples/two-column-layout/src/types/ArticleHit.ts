import { Hit } from '@algolia/client-search';

type ArticleRecord = {
  title: string;
  date: string;
  image_url: string;
};

export type ArticleHit = Hit<ArticleRecord>;
