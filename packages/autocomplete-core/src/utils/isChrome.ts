const chromeRegex = /(?:crmo|crios|chrome)\/v?([\w.]+)/i;
const edgeRegex = /edg(?:e|ios|a)?\/([\w.]+)/i;
const samsungBrowserRegex = /samsungbrowser\/([\w.]+)/i;
const chromiumRegex = /chromium[/ ]([-\w.]+)/i;

export function isChrome(userAgent: string) {
  return (
    userAgent &&
    Boolean(
      userAgent.match(chromeRegex) &&
        !userAgent.match(edgeRegex) &&
        !userAgent.match(samsungBrowserRegex) &&
        !userAgent.match(chromiumRegex)
    )
  );
}
