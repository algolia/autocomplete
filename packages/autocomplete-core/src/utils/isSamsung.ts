const regex = /((gt|sm)-|samsung[- ])\w+/i;

export function isSamsung(userAgent: string) {
  return Boolean(userAgent && userAgent.match(regex));
}
