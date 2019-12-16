import { Action, Event, ConcatMultiple } from 'moleculer-ts';

export const name: '$broker' = '$broker';

export type OwnActions = [];
export type OwnEvents = [Event<'started', {}>];

type Actions = ConcatMultiple<[OwnActions]>;
type Events = ConcatMultiple<[OwnEvents]>;
