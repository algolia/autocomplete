export function getAttributeValueByPath<TRecord>(
  record: TRecord,
  path: (string | number)[]
): any {
  return path.reduce((current, key) => current && current[key], record);
}
