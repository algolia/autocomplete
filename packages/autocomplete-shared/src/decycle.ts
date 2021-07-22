/**
 * Decycles objects with circular references.
 * This is used to print cyclic structures in development environment only.
 */
export function decycle(obj: any, seen = new Set()) {
  if (!__DEV__ || !obj || typeof obj !== 'object') {
    return obj;
  }

  if (seen.has(obj)) {
    return '[Circular]';
  }

  const newSeen = seen.add(obj);

  if (Array.isArray(obj)) {
    return obj.map((x) => decycle(x, newSeen));
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, decycle(value, newSeen)])
  );
}
