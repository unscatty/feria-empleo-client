export type TypeOfClassMethod<T, M extends keyof T> = T[M] extends any ? T[M] : never;
