export function isValidCommandSlug(token: string) {
  return /^\/[a-z]?/.test(token);
}
