export function splitQuery(query: string) {
  const [prefix, postfix] = query.split(':');

  return [prefix, postfix] as const;
}
