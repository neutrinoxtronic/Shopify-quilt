import type {Primitive} from '@shopify/useful-types';

export type DeepOmitOptional<T> = T extends Primitive
  ? T
  : {
      [K in keyof T]: {} extends Pick<T, K>
        ? never
        : T[K] extends infer TK
        ? TK extends (infer U)[]
          ? DeepOmitOptional<U>[]
          : TK extends ReadonlyArray<infer U>
          ? ReadonlyArray<DeepOmitOptional<U>>
          : DeepOmitOptional<TK>
        : T[K];
    };

export type Thunk<T, A = never> = ((arg: A) => T) | T;