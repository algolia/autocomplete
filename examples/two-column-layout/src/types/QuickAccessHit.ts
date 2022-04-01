import { Hit } from '@algolia/client-search';

type QuickAccessRecord = {
  template: 'sales-banner' | 'sales-code' | 'new-collection' | 'help';
  href: string;
  image: string;
  title: string;
  subtitle: string;
  date?: string;
  links?: Array<{
    text: string;
    href: string;
  }>;
};

export type QuickAccessHit = Hit<QuickAccessRecord>;
