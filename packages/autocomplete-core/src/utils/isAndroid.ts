const androidRegex = /android/i;
const windowsPhoneRegex = /(windows (?:phone|mobile))/i;

export function isAndroid(userAgent: string) {
  return Boolean(
    userAgent &&
      userAgent.match(androidRegex) &&
      !userAgent.match(windowsPhoneRegex)
  );
}
