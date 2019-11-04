import { Action, Event, ConcatMultiple } from '../src/index';

export const name: 'test' = 'test';

export type OwnActions = [
  Action<'create', { name: string }, string>,
  Action<'create', { age: number }, number>,
  Action<'create', {}, number>,

  Action<'get', { age: number }, string>,
  Action<'get', { age: number }, string>,
  Action<'get', {}, string>,
];

export type OwnEvents = [Event<'test.*', { age: number }>];

export type Actions = ConcatMultiple<[OwnActions]>;
export type Events = ConcatMultiple<[OwnEvents]>;
