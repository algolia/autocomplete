export function getActiveToken(input: string, cursorPosition: number) {
  const tokenizedQuery = input.split(/[\s\n]/).reduce((acc, word, index) => {
    const previous = acc[index - 1];
    const start = index === 0 ? index : previous.range[1] + 1;
    const end = start + word.length;

    return acc.concat([{ word, range: [start, end] }]);
  }, [] as Array<{ word: string; range: [number, number] }>);

  if (cursorPosition === undefined) {
    return undefined;
  }

  const activeToken = tokenizedQuery.find(
    ({ range }) => range[0] < cursorPosition && range[1] >= cursorPosition
  );

  return activeToken;
}
