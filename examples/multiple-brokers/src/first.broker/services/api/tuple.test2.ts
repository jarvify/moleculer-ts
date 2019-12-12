import { Action, Event, ConcatMultiple } from 'moleculer-ts';

type SomeActions = [Action<'custom', {}, number>];

export default SomeActions;
