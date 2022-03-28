export function intersperse(arr: any[], sep: any) {
  return arr.reduce((a, v) => [...a, v, sep], []).slice(0, -1);
}
