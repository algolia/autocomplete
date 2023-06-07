const regex = /((gt|sm)-|galaxy nexus)|samsung[- ]|samsungbrowser/i;

export function isSamsung(userAgent: string) {
  return Boolean(userAgent && userAgent.match(regex));
}
