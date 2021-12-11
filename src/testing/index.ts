// Inspired by https://github.com/type-challenges/type-challenges/blob/master/utils/index.d.ts
export type Assert<T> = T extends undefined ? never : T;
export type Expect<T extends true> = T;
export type Not<X> = X extends true ? false : true;
export type Extends<X, Y> = Y extends X ? true : false;
export type Equals<X, Y> =
    (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2) ? true : false;

// eslint-disable-next-line
export const tt: <T>() => () => any = () => () => expect(true).toBe(true);

export * from './mocking';
