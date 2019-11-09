export * from './utils';
export { ConcatMultiple } from 'typescript-tuple';
import { Union } from 'ts-toolbelt';

type GenericObject = {
  [key: string]: any;
};

export type Action<
  ActionName extends string,
  In extends GenericObject,
  Out extends any
> = {
  name: ActionName;
  in: In;
  out: Out;
};

export type Event<EventName extends string, In extends GenericObject> = {
  name: EventName;
  in: In;
};

type KeyOfTuple<T> = Exclude<keyof T, keyof Array<any>>;

export type GetNames<T extends any[]> = {
  [K in KeyOfTuple<T>]: T[K] extends { name: any } ? T[K]['name'] : never;
}[KeyOfTuple<T>];

export type GetAllNameKeysAndLength<T extends any[]> =
  | GetNameKeys<T, any>
  | 'length';

export type GetNameKeys<T extends any[], P extends GetNames<T>> = {
  [K in KeyOfTuple<T>]: T[K] extends { name: any }
    ? T[K]['name'] extends P
      ? K
      : never
    : never;
}[KeyOfTuple<T>];

export type GetParamsStrict<
  T extends any[],
  P extends GetNames<T>
> = Union.Strict<GetParams<T, P>>;

export type GetParams<T extends any[], P extends GetNames<T>> = {
  [K in GetNameKeys<T, P>]: T[K] extends { in: any } ? T[K]['in'] : never;
}[GetNameKeys<T, P>];

export type GetReturn<T extends any[], P extends GetNames<T>> = {
  [K in GetNameKeys<T, P>]: T[K] extends { out: any } ? T[K]['out'] : never;
}[GetNameKeys<T, P>];

export type GetServiceInterface<T extends any[]> = {
  [K in GetNames<T>]: (...args: any) => any;
};

export type FiniteL9<T> = {
  [K in keyof T]: T[K] extends Array<infer U>
    ? Array<FiniteL8<U>>
    : FiniteL8<T[K]>;
};

export type FiniteL8<T> = {
  [K in keyof T]: T[K] extends Array<infer U>
    ? Array<FiniteL7<U>>
    : FiniteL7<T[K]>;
};

export type FiniteL7<T> = {
  [K in keyof T]: T[K] extends Array<infer U>
    ? Array<FiniteL6<U>>
    : FiniteL6<T[K]>;
};

export type FiniteL6<T> = {
  [K in keyof T]: T[K] extends Array<infer U>
    ? Array<FiniteL5<U>>
    : FiniteL5<T[K]>;
};

export type FiniteL5<T> = {
  [K in keyof T]: T[K] extends Array<infer U>
    ? Array<FiniteL4<U>>
    : FiniteL4<T[K]>;
};

export type FiniteL4<T> = {
  [K in keyof T]: T[K] extends Array<infer U>
    ? Array<FiniteL3<U>>
    : FiniteL3<T[K]>;
};

export type FiniteL3<T> = {
  [K in keyof T]: T[K] extends Array<infer U>
    ? Array<FiniteL2<U>>
    : FiniteL2<T[K]>;
};

export type FiniteL2<T> = {
  [K in keyof T]: T[K] extends Array<infer U>
    ? Array<FiniteL1<U>>
    : FiniteL1<T[K]>;
};

export type FiniteL1<T> = {
  [K in keyof T]: T[K] extends any[] ? any[] : any;
};
