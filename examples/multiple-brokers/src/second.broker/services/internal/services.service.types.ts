import { Action, Event, ConcatMultiple } from 'moleculer-ts';

export const name: '$services' = '$services';

export type OwnActions = [];
export type OwnEvents = [Event<'changed', { localService: boolean }>];

export type Actions = ConcatMultiple<[OwnActions]>;
export type Events = ConcatMultiple<[OwnEvents]>;
