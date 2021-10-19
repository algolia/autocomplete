export function isValidEmoji(token: string) {
  return /^:[a-z-]+:?$/.test(token);
}
