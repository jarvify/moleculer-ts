import { Action, Event, ConcatMultiple } from 'moleculer-ts';

export type SomeActions = [Action<'custom', {}, number>];
export default SomeActions;
