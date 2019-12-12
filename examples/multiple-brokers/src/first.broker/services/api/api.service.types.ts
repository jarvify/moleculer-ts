import { Action, Event, ConcatMultiple } from 'moleculer-ts';

import { SomeActions as Idk } from './tuple.test';

import { SomeActions } from './tuple.test';

import { SomeActions as SomeActions2 } from '@first.broker/services/api/tuple.test';

// dont care ! but doable
import * as SomeActionsStar from './tuple.test';
// not acceptable - very hard to do
import defaultB, { default as K } from './tuple.test2';

type C = SomeActionsStar.SomeActions;

export const name: 'api' = 'api';

export type OwnActions = [
  Action<'request', { req: any; res: any }, string>,
  Action<'context', { user: { id: string }; account: { id: string } }, number>,
];

export type OwnEvents = [];

type Actions = ConcatMultiple<
  [
    OwnActions,
    Idk,
    SomeActions,
    SomeActions2,
    SomeActionsStar.SomeActions,
    defaultB,
    K,
  ]
>;
type Events = ConcatMultiple<[OwnEvents]>;
