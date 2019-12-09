import * as MoleculerTs from 'moleculer-ts';
import * as Broker from './moleculer';
import * as Services from './services.types';

export interface ServiceBroker {
  call<T extends ServiceActionNames>(
    actionName: T,
    params: GetCallParams[T],
    opts?: Broker.CallingOptions,
  ): GetCallReturn[T];

  emit<T extends ServiceEventNames>(
    eventName: T,
    payload: GetEmitParams[T],
    groups?: ServiceNamesEmitGroup,
  ): void;

  broadcast: ServiceBroker['emit'];
  broadcastLocal: ServiceBroker['emit'];
}

type GetCallParams = {
  'api.request': Services.ApiServiceTypes.Actions[0]['in'];
  'api.context': Services.ApiServiceTypes.Actions[1]['in'];
  'v1.api.request': Services.V1apiServiceTypes.Actions[0]['in'];
  'v1.api.context': Services.V1apiServiceTypes.Actions[1]['in'];
  'user.create': Services.UserServiceTypes.Actions[0]['in'];
  'user.get': Services.UserServiceTypes.Actions[1]['in'];
  'user.delete': Services.UserServiceTypes.Actions[2]['in'];
};
type GetCallReturn = {
  'api.request': Services.ApiServiceTypes.Actions[0]['out'];
  'api.context': Services.ApiServiceTypes.Actions[1]['out'];
  'v1.api.request': Services.V1apiServiceTypes.Actions[0]['out'];
  'v1.api.context': Services.V1apiServiceTypes.Actions[1]['out'];
  'user.create': Services.UserServiceTypes.Actions[0]['out'];
  'user.get': Services.UserServiceTypes.Actions[1]['out'];
  'user.delete': Services.UserServiceTypes.Actions[2]['out'];
};
type GetEmitParams = {
  'user.nodeChange': MoleculerTs.Union.Strict<
    Services.UserServiceTypes.Events[0]['in']
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
