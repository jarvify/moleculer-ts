import { Action, Event, ConcatMultiple } from 'moleculer-ts';

export const name: '$transporter' = '$transporter';

export type OwnActions = [];
export type OwnEvents = [Event<'connected', {}>, Event<'disconnected', {}>];

type Actions = ConcatMultiple<[OwnActions]>;
type Events = ConcatMultiple<[OwnEvents]>;
