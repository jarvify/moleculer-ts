import { Action, Event, ConcatMultiple } from 'moleculer-ts';

export const name: '$services' = '$services';

export type OwnActions = [];
export type OwnEvents = [Event<'changed', { localService: boolean }>];

type Actions = ConcatMultiple<[OwnActions]>;
type Events = ConcatMultiple<[OwnEvents]>;
