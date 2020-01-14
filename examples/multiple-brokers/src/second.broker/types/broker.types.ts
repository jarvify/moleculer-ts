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

type GetCallParams = {};

type GetCallReturn = {};

type GetEmitParams = {
  '$broker.started': MoleculerTs.Union.Strict<
    Services.BrokerServiceTypes.Events[0]['in']
  >;
  '$circuit-breaker.opened': MoleculerTs.Union.Strict<
    Services.CircuitBreakerServiceTypes.Events[0]['in']
  >;
  '$circuit-breaker.half-opened': MoleculerTs.Union.Strict<
    Services.CircuitBreakerServiceTypes.Events[1]['in']
  >;
  '$circuit-breaker.closed': MoleculerTs.Union.Strict<
    Services.CircuitBreakerServiceTypes.Events[2]['in']
  >;
  '$node.connected': MoleculerTs.Union.Strict<
    Services.NodeServiceTypes.Events[0]['in']
  >;
  '$node.updated': MoleculerTs.Union.Strict<
    Services.NodeServiceTypes.Events[1]['in']
  >;
  '$node.disconnected': MoleculerTs.Union.Strict<
    Services.NodeServiceTypes.Events[2]['in']
  >;
  '$services.changed': MoleculerTs.Union.Strict<
    Services.ServicesServiceTypes.Events[0]['in']
  >;
  '$transporter.connected': MoleculerTs.Union.Strict<
    Services.TransporterServiceTypes.Events[0]['in']
  >;
  '$transporter.disconnected': MoleculerTs.Union.Strict<
    Services.TransporterServiceTypes.Events[1]['in']
  >;
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
