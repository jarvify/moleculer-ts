import { Action, Event, ConcatMultiple } from 'moleculer-ts';

type NodeInfo = {
  nodeID: string;
};

export const name: '$node' = '$node';

export type OwnActions = [];
export type OwnEvents = [
  Event<'connected', { node: NodeInfo; reconnected: boolean }>,
  Event<'updated', { node: NodeInfo }>,
  Event<'disconnected', { node: NodeInfo; unexpected: boolean }>,
];

export type Actions = ConcatMultiple<[OwnActions]>;
export type Events = ConcatMultiple<[OwnEvents]>;
