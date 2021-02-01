export function getAttributeValueByPath<THit>(hit: THit, path: string[]): any {
  return path.reduce((current, key) => current && current[key], hit);
}
