import '@umijs/max/typings';

declare module 'await-to-js' {
  function to<T, U = any>(
    promise: Promise<T>,
    errorExt?: object,
  ): Promise<[U, undefined] | [null, T]>;
}
