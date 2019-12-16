import { Action, Event, ConcatMultiple } from 'moleculer-ts';

export const name: 'test' = 'test';

export type OwnActions = [];
export type OwnEvents = [];

type Actions = ConcatMultiple<[OwnActions]>;
type Events = ConcatMultiple<[OwnEvents]>;
