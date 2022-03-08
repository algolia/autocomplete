const mobileRegex = /\b((?:s[cgp]h|gt|sm)-\w+|galaxy nexus)|samsung[- ]([-\w]+)|sec-(sgh\w+)/i;
const tabletRegex = /\b(sch-i[89]0\d|shw-m380s|sm-[pt]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i;

export function isSamsung(userAgent: string) {
  return Boolean(userAgent.match(mobileRegex) || userAgent.match(tabletRegex));
}
