import { Action, Event, ConcatMultiple } from 'moleculer-ts';

export const name: '$transporter' = '$transporter';

export type OwnActions = [];
export type OwnEvents = [Event<'connected', {}>, Event<'disconnected', {}>];

export type Actions = ConcatMultiple<[OwnActions]>;
export type Events = ConcatMultiple<[OwnEvents]>;
