export function concatClassNames(classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ');
}
