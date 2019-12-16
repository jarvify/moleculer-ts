import { Action, Event, ConcatMultiple } from 'moleculer-ts';

type SomeActions2 = [Action<'custom2', {}, number>];

export type SomeActions3 = [Action<'custom3', {}, number>];

export default SomeActions2;
