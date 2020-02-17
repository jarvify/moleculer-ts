export * from './utils';
import { ConcatMultiple as ConcatMultipleTuple } from 'typescript-tuple';

export type ConcatMultiple<
  TupleSet extends { name: string; in: GenericObject; out?: any }[][]
> = ConcatMultipleTuple<TupleSet>;

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

export type GetParams<T extends any[], P extends GetNames<T>> = {
  [K in GetNameKeys<T, P>]: T[K] extends { in: any } ? T[K]['in'] : never;
}[GetNameKeys<T, P>];

export type GetReturn<T extends any[], P extends GetNames<T>> = {
  [K in GetNameKeys<T, P>]: T[K] extends { out: any } ? T[K]['out'] : never;
}[GetNameKeys<T, P>];

export type GetServiceOwnActions<T extends any[]> = {
  [K in GetNames<T>]: (...args: any) => any;
};
