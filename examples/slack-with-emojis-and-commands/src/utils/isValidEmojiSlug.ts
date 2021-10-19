export function isValidEmojiSlug(token: string) {
  return /^:[a-z-]+:?$/.test(token);
}
