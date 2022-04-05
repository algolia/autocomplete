const chromeRegex = /(crmo|crios|chrome)/i;
const edgeRegex = /edg(e|ios|a)?/i;
const chromiumRegex = /chromium/i;

export function isChrome(userAgent: string) {
  return Boolean(
    userAgent &&
      userAgent.match(chromeRegex) &&
      !userAgent.match(edgeRegex) &&
      !userAgent.match(chromiumRegex)
  );
}
