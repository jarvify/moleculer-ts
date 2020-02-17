import * as MoleculerTs from 'moleculer-ts';
import * as Moleculer from './moleculer';
import * as Services from './services.types';

export interface ServiceBroker {
  call<T extends ServiceActionNames>(
    actionName: T,
    params: GetCallParams[T],
    opts?: Moleculer.CallingOptions,
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

export type GetEmitParams = {
  '$broker.started': Services.BrokerServiceTypes.Events[0]['in'];
  '$circuit-breaker.opened': Services.CircuitBreakerServiceTypes.Events[0]['in'];
  '$circuit-breaker.half-opened': Services.CircuitBreakerServiceTypes.Events[1]['in'];
  '$circuit-breaker.closed': Services.CircuitBreakerServiceTypes.Events[2]['in'];
  '$node.connected': Services.NodeServiceTypes.Events[0]['in'];
  '$node.updated': Services.NodeServiceTypes.Events[1]['in'];
  '$node.disconnected': Services.NodeServiceTypes.Events[2]['in'];
  '$services.changed': Services.ServicesServiceTypes.Events[0]['in'];
  '$transporter.connected': Services.TransporterServiceTypes.Events[0]['in'];
  '$transporter.disconnected': Services.TransporterServiceTypes.Events[1]['in'];
};

export type ServiceNames = Exclude<never | 'test', never>;
export type ServiceEventNames = Exclude<
  | never
  | '$broker.started'
  | '$circuit-breaker.opened'
  | '$circuit-breaker.half-opened'
  | '$circuit-breaker.closed'
  | '$node.connected'
  | '$node.updated'
  | '$node.disconnected'
  | '$services.changed'
  | '$transporter.connected'
  | '$transporter.disconnected',
  never
>;
export type ServiceActionNames = Exclude<never, never>;
export type ServiceNamesEmitGroup = ServiceNames | ServiceNames[];
