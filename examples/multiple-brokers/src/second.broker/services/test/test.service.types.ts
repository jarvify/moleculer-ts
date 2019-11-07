import { Action, Event, ConcatMultiple } from 'moleculer-ts';

export const name: 'test' = 'test';

export type OwnActions = [];

export type OwnEvents = [];

export type Actions = ConcatMultiple<[OwnActions]>;
export type Events = ConcatMultiple<[OwnEvents]>;
