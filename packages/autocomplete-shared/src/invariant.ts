/**
 * Throws an error if the condition is not met in development monde.
 * This is used to make development a better experience to provide guidance as
 * to where the error comes from.
 */
export function invariant(condition: boolean, message: string) {
  if (!__DEV__) {
    return;
  }

  if (!condition) {
    throw new Error(`[Autocomplete] ${message}`);
  }
}
