import { Action, Event, ConcatMultiple } from 'moleculer-ts';

export const name: '$circuit-breaker' = '$circuit-breaker';

export type OwnActions = [];
export type OwnEvents = [
  Event<'opened', { nodeID: string; action: string; failures: number }>,
  Event<'half-opened', { nodeID: string; action: string }>,
  Event<'closed', { nodeID: string; action: string }>,
];

type Actions = ConcatMultiple<[OwnActions]>;
type Events = ConcatMultiple<[OwnEvents]>;
