import { Action, Event, ConcatMultiple } from '../src/index';

import {} from 'moleculer-ts';

import { ApiServiceTypes } from '../test/types';

export const name: 'api' = 'api';

export type OwnActions = [
  Action<'request', { req: any; res: any }, string>,
  Action<'context', { user: { id: string }; account: { id: string } }, number>,
];

export type OwnEvents = [Event<'test', { name: string }>];

export type Actions = ConcatMultiple<[OwnActions]>;
export type Events = ConcatMultiple<[OwnEvents]>;
