import * as MoleculerTs from 'moleculer-ts';
import * as Broker from './moleculer';
import * as Services from './services.types';

type StrictObject<P, A> = A & { [K in Exclude<keyof P, keyof A>]: never };

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

type GetCallParams<P> = {
  'api.request': Services.ApiServiceTypes.Actions[0]['in'] extends P
    ? Services.ApiServiceTypes.Actions[0]['in']
    : Services.ApiServiceTypes.Actions[1]['in'] extends P
    ? Services.ApiServiceTypes.Actions[1]['in']
    : Services.ApiServiceTypes.Actions[2]['in'] extends P
    ? Services.ApiServiceTypes.Actions[2]['in']
    : StrictObject<
        P,
        MoleculerTs.Union.Strict<
          | Services.ApiServiceTypes.Actions[0]['in']
          | Services.ApiServiceTypes.Actions[1]['in']
          | Services.ApiServiceTypes.Actions[2]['in']
        >
      >;
  'api.context': Services.ApiServiceTypes.Actions[3]['in'] extends P
    ? Services.ApiServiceTypes.Actions[3]['in']
    : StrictObject<
        P,
        MoleculerTs.Union.Strict<Services.ApiServiceTypes.Actions[3]['in']>
      >;
  'v1.api.request': Services.V1apiServiceTypes.Actions[0]['in'] extends P
    ? Services.V1apiServiceTypes.Actions[0]['in']
    : StrictObject<
        P,
        MoleculerTs.Union.Strict<Services.V1apiServiceTypes.Actions[0]['in']>
      >;
  'v1.api.context': Services.V1apiServiceTypes.Actions[1]['in'] extends P
    ? Services.V1apiServiceTypes.Actions[1]['in']
    : StrictObject<
        P,
        MoleculerTs.Union.Strict<Services.V1apiServiceTypes.Actions[1]['in']>
      >;
  'user.create': Services.UserServiceTypes.Actions[0]['in'] extends P
    ? Services.UserServiceTypes.Actions[0]['in']
    : Services.UserServiceTypes.Actions[1]['in'] extends P
    ? Services.UserServiceTypes.Actions[1]['in']
    : Services.UserServiceTypes.Actions[2]['in'] extends P
    ? Services.UserServiceTypes.Actions[2]['in']
    : StrictObject<
        P,
        MoleculerTs.Union.Strict<
          | Services.UserServiceTypes.Actions[0]['in']
          | Services.UserServiceTypes.Actions[1]['in']
          | Services.UserServiceTypes.Actions[2]['in']
        >
      >;
  'user.get': Services.UserServiceTypes.Actions[3]['in'] extends P
    ? Services.UserServiceTypes.Actions[3]['in']
    : Services.UserServiceTypes.Actions[4]['in'] extends P
    ? Services.UserServiceTypes.Actions[4]['in']
    : StrictObject<
        P,
        MoleculerTs.Union.Strict<
          | Services.UserServiceTypes.Actions[3]['in']
          | Services.UserServiceTypes.Actions[4]['in']
        >
      >;
  'user.delete': Services.UserServiceTypes.Actions[5]['in'] extends P
    ? Services.UserServiceTypes.Actions[5]['in']
    : StrictObject<
        P,
        MoleculerTs.Union.Strict<Services.UserServiceTypes.Actions[5]['in']>
      >;
};
type GetCallReturn<P> = {
  'api.request': Services.ApiServiceTypes.Actions[0]['in'] extends P
    ? Services.ApiServiceTypes.Actions[0]['out']
    : Services.ApiServiceTypes.Actions[1]['in'] extends P
    ? Services.ApiServiceTypes.Actions[1]['out']
    : Services.ApiServiceTypes.Actions[2]['in'] extends P
    ? Services.ApiServiceTypes.Actions[2]['out']
    : never;
  'api.context': Services.ApiServiceTypes.Actions[3]['in'] extends P
    ? Services.ApiServiceTypes.Actions[3]['out']
    : never;
  'v1.api.request': Services.V1apiServiceTypes.Actions[0]['in'] extends P
    ? Services.V1apiServiceTypes.Actions[0]['out']
    : never;
  'v1.api.context': Services.V1apiServiceTypes.Actions[1]['in'] extends P
    ? Services.V1apiServiceTypes.Actions[1]['out']
    : never;
  'user.create': Services.UserServiceTypes.Actions[0]['in'] extends P
    ? Services.UserServiceTypes.Actions[0]['out']
    : Services.UserServiceTypes.Actions[1]['in'] extends P
    ? Services.UserServiceTypes.Actions[1]['out']
    : Services.UserServiceTypes.Actions[2]['in'] extends P
    ? Services.UserServiceTypes.Actions[2]['out']
    : never;
  'user.get': Services.UserServiceTypes.Actions[3]['in'] extends P
    ? Services.UserServiceTypes.Actions[3]['out']
    : Services.UserServiceTypes.Actions[4]['in'] extends P
    ? Services.UserServiceTypes.Actions[4]['out']
    : never;
  'user.delete': Services.UserServiceTypes.Actions[5]['in'] extends P
    ? Services.UserServiceTypes.Actions[5]['out']
    : never;
};
type GetEmitParams<P> = {
  'user.nodeChange': Services.UserServiceTypes.Events[0]['in'] extends P
    ? Services.UserServiceTypes.Events[0]['in']
    : StrictObject<
        P,
        MoleculerTs.Union.Strict<Services.UserServiceTypes.Events[0]['in']>
      >;
};
export type ServiceNames = Exclude<never | 'api' | 'v1.api' | 'user', never>;
export type ServiceNamesEmitGroup = ServiceNames | ServiceNames[];
export type ServiceEventNames = Exclude<never | 'user.nodeChange', never>;
export type ServiceActionNames = Exclude<
  | never
  | 'api.request'
  | 'api.context'
  | 'v1.api.request'
  | 'v1.api.context'
  | 'user.create'
  | 'user.get'
  | 'user.delete',
  never
>;
