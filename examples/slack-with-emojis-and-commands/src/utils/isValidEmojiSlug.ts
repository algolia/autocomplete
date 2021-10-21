export function isValidEmojiSlug(token: string) {
  return /^:[a-z-_]+:?$/.test(token);
}
