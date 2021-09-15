export function isValidTwitterUsername(username: string) {
  return (
    username.startsWith('@') &&
    username.length > 1 &&
    username.length <= 15 &&
    /^@\w+$/.test(username)
  );
}
