const androidRegex = /android[-/ ]?([\w.]*)/i;
const windowsPhoneRegex = /(windows (?:phone(?: os)?|mobile))[/ ]?([\d.\w ]*)/i;

export function isAndroid(userAgent: string) {
  return (
    userAgent &&
    Boolean(
      userAgent.match(androidRegex) && !userAgent.match(windowsPhoneRegex)
    )
  );
}
