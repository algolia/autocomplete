export function isValidTwitterUsername(username: string) {
  return /^@\w{1,15}$/.test(username);
}
