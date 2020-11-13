export type PathOf<T extends object> = {
  [K in keyof T]: T[K] extends object ? [K, ...PathOf<T[K]>] : [K];
}[keyof T];
