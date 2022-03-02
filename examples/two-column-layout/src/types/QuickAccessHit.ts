import { Hit } from '@algolia/client-search';

type QuickAccessRecordLink = {
  text: string;
  href: string;
};

type QuickAccessRecord = {
  template: 'sales-banner' | 'sales-code' | 'new-collection' | 'help';
  href: string;
  image: string;
  title: string;
  subtitle: string;
  date?: string;
  links?: QuickAccessRecordLink[];
};

export type QuickAccessHit = Hit<QuickAccessRecord>;
