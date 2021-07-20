/**
 * Throws an error if the condition is not met in development mode.
 * This is used to make development a better experience to provide guidance as
 * to where the error comes from.
 */
export function invariant(
  condition: boolean,
  message: string | (() => string)
) {
  if (!__DEV__) {
    return;
  }

  if (!condition) {
    const _message = typeof message === 'string' ? message : message();

    throw new Error(`[Autocomplete] ${_message}`);
  }
}
