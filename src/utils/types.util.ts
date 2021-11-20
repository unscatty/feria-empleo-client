export type TypeOfClassMethod<T, M extends keyof T> = T[M] extends any ? T[M] : never;

export type RemoveTimeStamps<Model> = Omit<Model, 'createdAt' | 'updatedAt' | 'deletedAt'>;

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}
