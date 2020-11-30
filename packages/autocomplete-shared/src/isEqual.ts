function isPrimitive(obj: any): boolean {
  return obj !== Object(obj);
}

export function isEqual(first: any, second: any): boolean {
  if (first === second) {
    return true;
  }

  if (
    isPrimitive(first) ||
    isPrimitive(second) ||
    typeof first === 'function' ||
    typeof second === 'function'
  ) {
    return first === second;
  }

  if (Object.keys(first).length !== Object.keys(second).length) {
    return false;
  }

  for (const key of Object.keys(first)) {
    if (!(key in second)) {
      return false;
    }

    if (!isEqual(first[key], second[key])) {
      return false;
    }
  }

  return true;
}
