import { Action, Event, ConcatMultiple } from 'moleculer-ts';

export const name: 'api' = 'api';

export type OwnActions = [
  Action<'request', { req: Request; res: any }, string>,
  Action<'context', { user: { id: string }; account: { id: string } }, number>,
];

export type OwnEvents = [];

export type Actions = ConcatMultiple<[OwnActions]>;
export type Events = ConcatMultiple<[OwnEvents]>;
