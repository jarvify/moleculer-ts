import * as MoleculerTs from 'moleculer-ts';
import * as Broker from './moleculer';
import * as Services from './services.types';

export interface ServiceBroker {
  call<T extends ServiceActionNames>(
    actionName: T,
    params: GetCallParams[T],
    opts?: Broker.CallingOptions,
  ): PromiseLike<GetCallReturn[T]>;

  emit<T extends ServiceEventNames>(
    eventName: T,
    payload: GetEmitParams[T],
    groups?: ServiceNamesEmitGroup,
  ): void;

  broadcast: ServiceBroker['emit'];
  broadcastLocal: ServiceBroker['emit'];
}

export type GetCallParams = {};

export type GetCallReturn = {};

export type GetEmitParams = {};

export type ServiceNames = Exclude<never, never>;
export type ServiceEventNames = Exclude<never, never>;
export type ServiceActionNames = Exclude<never, never>;
export type ServiceNamesEmitGroup = ServiceNames | ServiceNames[];
