const regex = /android[-/ ]?([\w.]*)/i;

export function isAndroid(userAgent: string) {
  return Boolean(userAgent.match(regex));
}
