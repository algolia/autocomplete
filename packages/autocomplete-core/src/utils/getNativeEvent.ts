export function getNativeEvent<TEvent>(event: TEvent) {
  return (event as unknown as { nativeEvent: TEvent }).nativeEvent || event;
}
