import * as MoleculerTs from 'moleculer-ts';
import * as Broker from './moleculer';
import * as Services from './services.types';

type StrictObject<P, A> = A & { [K in Exclude<keyof P, keyof A>]: never };

type PickByParam<P, A> = {
  [K in keyof P]: K extends keyof A ? A[K] : never;
};

export interface ServiceBroker {
  call<T extends ServiceActionNames, P extends GetCallParams<P>[T]>(
    actionName: T,
    params: P,
    opts?: Broker.CallingOptions,
  ): PromiseLike<GetCallReturn<P>[T]>;

  emit<T extends ServiceEventNames, P extends GetEmitParams<P>[T]>(
    eventName: T,
    payload: P,
    groups?: ServiceNamesEmitGroup,
  ): void;

  broadcast: ServiceBroker['emit'];
  broadcastLocal: ServiceBroker['emit'];
}

type GetCallParams<P> = {};
type GetCallReturn<P> = {};
type GetEmitParams<P> = {
  '$broker.started': Services.BrokerServiceTypes.Events[0]['in'] extends P
    ? Services.BrokerServiceTypes.Events[0]['in']
    : StrictObject<
        P,
        MoleculerTs.Union.Strict<Services.BrokerServiceTypes.Events[0]['in']>
      >;
  '$circuit-breaker.opened': Services.CircuitbreakerServiceTypes.Events[0]['in'] extends P
    ? Services.CircuitbreakerServiceTypes.Events[0]['in']
    : StrictObject<
        P,
        MoleculerTs.Union.Strict<
          Services.CircuitbreakerServiceTypes.Events[0]['in']
        >
      >;
  '$circuit-breaker.half-opened': Services.CircuitbreakerServiceTypes.Events[1]['in'] extends P
    ? Services.CircuitbreakerServiceTypes.Events[1]['in']
    : StrictObject<
        P,
        MoleculerTs.Union.Strict<
          Services.CircuitbreakerServiceTypes.Events[1]['in']
        >
      >;
  '$circuit-breaker.closed': Services.CircuitbreakerServiceTypes.Events[2]['in'] extends P
    ? Services.CircuitbreakerServiceTypes.Events[2]['in']
    : StrictObject<
        P,
        MoleculerTs.Union.Strict<
          Services.CircuitbreakerServiceTypes.Events[2]['in']
        >
      >;
  '$node.connected': Services.NodeServiceTypes.Events[0]['in'] extends P
    ? Services.NodeServiceTypes.Events[0]['in']
    : StrictObject<
        P,
        MoleculerTs.Union.Strict<Services.NodeServiceTypes.Events[0]['in']>
      >;
  '$node.updated': Services.NodeServiceTypes.Events[1]['in'] extends P
    ? Services.NodeServiceTypes.Events[1]['in']
    : StrictObject<
        P,
        MoleculerTs.Union.Strict<Services.NodeServiceTypes.Events[1]['in']>
      >;
  '$node.disconnected': Services.NodeServiceTypes.Events[2]['in'] extends P
    ? Services.NodeServiceTypes.Events[2]['in']
    : StrictObject<
        P,
        MoleculerTs.Union.Strict<Services.NodeServiceTypes.Events[2]['in']>
      >;
  '$services.changed': Services.ServicesServiceTypes.Events[0]['in'] extends P
    ? Services.ServicesServiceTypes.Events[0]['in']
    : StrictObject<
        P,
        MoleculerTs.Union.Strict<Services.ServicesServiceTypes.Events[0]['in']>
      >;
  '$transporter.connected': Services.TransporterServiceTypes.Events[0]['in'] extends P
    ? Services.TransporterServiceTypes.Events[0]['in']
    : StrictObject<
        P,
        MoleculerTs.Union.Strict<
          Services.TransporterServiceTypes.Events[0]['in']
        >
      >;
  '$transporter.disconnected': Services.TransporterServiceTypes.Events[1]['in'] extends P
    ? Services.TransporterServiceTypes.Events[1]['in']
    : StrictObject<
        P,
        MoleculerTs.Union.Strict<
          Services.TransporterServiceTypes.Events[1]['in']
        >
      >;
};
export type ServiceNames = Exclude<never | 'test', never>;
export type ServiceNamesEmitGroup = ServiceNames | ServiceNames[];
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
