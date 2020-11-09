export function flatten<TType>(values: Array<TType | TType[]>): TType[] {
  return values.reduce<TType[]>((a, b) => {
    return a.concat(b);
  }, []);
}
