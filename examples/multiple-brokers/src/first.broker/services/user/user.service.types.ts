import { Action, Event, ConcatMultiple } from 'moleculer-ts';

export const name: 'user' = 'user';

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  arr?: User[];
};

export type OwnActions = [
  Action<'create', User, { id: string }>,
  Action<'get', { email: string }, User>,
  Action<'delete', { id: string }, User>,
];

export type OwnEvents = [Event<'nodeChange', User>];

export type Actions = ConcatMultiple<[OwnActions]>;
export type Events = ConcatMultiple<[OwnEvents]>;
