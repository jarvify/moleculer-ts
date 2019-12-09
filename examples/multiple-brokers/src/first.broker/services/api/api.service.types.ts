import { Action, Event, ConcatMultiple } from 'moleculer-ts';
import { IncomingMessage } from 'http';
export const name: 'api' = 'api';

export type OwnActions = [
  Action<'request', { req: any; res: any }, string>,
  Action<'context', { user: { id: string }; account: { id: string } }, number>,
];

export type OwnEvents = [];

export type Actions = ConcatMultiple<[OwnActions]>;
export type Events = ConcatMultiple<[OwnEvents]>;
