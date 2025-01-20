import type { JSX } from 'react';

export type Command = {
  slug: string;
  commands: string[];
  icon: JSX.Element;
  description: string;
};
