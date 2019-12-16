import { Action, Event, ConcatMultiple } from 'moleculer-ts';

import SomeActions2, { SomeActions3 } from './tuple.test2';

import { SomeActions as SomeActions1 } from '@first.broker/services/api/tuple.test';

// dont care ! but doable
// import * as SomeActionsStar from './tuple.test';
// not acceptable - very hard to do
// import defaultB, { default as K } from './tuple.test2';

export const name: 'api' = 'api';

export type OwnActions = [
  Action<'request', { req: any; res: any }, string>,
  Action<'context', { user: { id: string }; account: { id: string } }, number>,
];

export type OwnEvents = [];

type Actions = ConcatMultiple<
  [OwnActions, SomeActions1, SomeActions2, SomeActions3]
>;
type Events = ConcatMultiple<[OwnEvents]>;
