const regex = /(?:crmo|crios|chrome)\/v?([\w.]+)/i;

export function isChrome(userAgent: string) {
  return Boolean(userAgent?.match(regex));
}
