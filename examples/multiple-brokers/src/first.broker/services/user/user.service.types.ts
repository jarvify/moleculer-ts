import { Action, Event, ConcatMultiple } from 'moleculer-ts';

export const name: 'user' = 'user';

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type OwnActions = [
  Action<'create', { name: string }, User>,
  Action<'create', { name: string; $info: string }, unknown>,
  Action<'get', { id: string }, User>,
  Action<'get', { email: string }, User>,
  Action<'delete', { id: string }, User>,
];

export type OwnEvents = [Event<'nodeChange', User>];

export type Actions = ConcatMultiple<[OwnActions]>;
export type Events = ConcatMultiple<[OwnEvents]>;
