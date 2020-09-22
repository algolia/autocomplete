export function getAttributeValueByPath<THit>(hit: THit, path: string): any {
  const parts = path.split('.');
  const value = parts.reduce((current, key) => current && current[key], hit);

  return value;
}
