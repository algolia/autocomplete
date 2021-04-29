/**
 * Detect when an event is modified with a special key to let the browser
 * trigger its default behavior.
 */
export function isModifierEvent<TEvent extends MouseEvent | KeyboardEvent>(
  event: TEvent
): boolean {
  const isMiddleClick = (event as MouseEvent).button === 1;

  return (
    isMiddleClick ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  );
}
