import { Action, Event, ConcatMultiple } from 'moleculer-ts';

export const name: '$broker' = '$broker';

export type OwnActions = [];
export type OwnEvents = [Event<'started', {}>];

export type Actions = ConcatMultiple<[OwnActions]>;
export type Events = ConcatMultiple<[OwnEvents]>;
