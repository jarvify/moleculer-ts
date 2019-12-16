import { Action, Event, ConcatMultiple } from 'moleculer-ts';
export const name: 'api' = 'api';

export type OwnActions = [
  Action<'request', { req: any; res: any }, string>,
  Action<'context', { user: { id: string }; account: { id: string } }, number>,
];

export type OwnEvents = [];

type Actions = ConcatMultiple<[OwnActions]>;
type Events = ConcatMultiple<[OwnEvents]>;
