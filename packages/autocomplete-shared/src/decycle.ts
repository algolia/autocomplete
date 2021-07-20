/**
 * Decycles objects with circular references.
 */
export function decycle(obj: any, seen: any[] = []) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (seen.includes(obj)) {
    return '[Circular]';
  }

  const newSeen = seen.concat([obj]);

  if (Array.isArray(obj)) {
    return obj.map((x) => decycle(x, newSeen));
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, decycle(value, newSeen)])
  );
}
