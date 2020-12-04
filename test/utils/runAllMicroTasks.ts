export function runAllMicroTasks(): Promise<void> {
  return new Promise(setImmediate);
}
