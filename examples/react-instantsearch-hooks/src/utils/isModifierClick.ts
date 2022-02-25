export function isModifierClick(event: React.MouseEvent) {
  const isMiddleClick = event.button === 1;
  return Boolean(
    isMiddleClick ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
  );
}
