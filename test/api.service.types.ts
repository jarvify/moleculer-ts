import { Action, Event, ConcatMultiple } from '../src/index';

import { ApiServiceTypes } from '../test/types';

type Test = ApiServiceTypes.

export const name: 'api' = 'api';

export type OwnActions = [
  Action<'upsert', { name: string }, string>,
  Action<'delete', { age: number }, number>,
];

export type OwnEvents = [Event<'test', { name: string }>];

export type Actions = ConcatMultiple<[OwnActions]>;
export type Events = ConcatMultiple<[OwnEvents]>;
