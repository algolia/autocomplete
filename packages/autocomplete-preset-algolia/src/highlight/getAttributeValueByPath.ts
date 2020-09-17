export function getAttributeValueByPath<THit>(hit: THit, path: string): string {
  const parts = path.split('.');
  const value = parts.reduce<string>(
    (current, key) => current && current[key],
    hit as any
  );

  if (typeof value !== 'string') {
    throw new Error(
      `The attribute ${JSON.stringify(path)} does not exist on the hit.`
    );
  }

  return value;
}
