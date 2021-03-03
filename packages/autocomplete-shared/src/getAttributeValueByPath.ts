export function getAttributeValueByPath<TRecord>(
  record: TRecord,
  path: string[]
): any {
  return path.reduce((current, key) => current && current[key], record);
}
