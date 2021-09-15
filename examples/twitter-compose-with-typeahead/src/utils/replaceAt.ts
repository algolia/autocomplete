export function replaceAt(str: string, replacement: string, index: number) {
  return (
    str.substr(0, index) + replacement + str.substr(index + replacement.length)
  );
}
