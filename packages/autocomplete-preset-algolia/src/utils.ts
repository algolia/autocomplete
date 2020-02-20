export function flatten<TType = any>(values: TType[]): TType[] {
  return values.reduce<TType[]>((a, b) => {
    return a.concat(b);
  }, []);
}
