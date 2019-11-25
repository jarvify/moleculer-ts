import * as Broker from './moleculer';
import * as Services from './services.types';
export interface ServiceBroker {
  call(actionName: never): never;
  emit(actionName: never): never;

  call(
    actionName: 'api.request',
    params: Services.ApiServiceTypes.Actions[0]['in'],
    opts?: Broker.CallingOptions,
  ): PromiseLike<Services.ApiServiceTypes.Actions[0]['out']>;

  call(
    actionName: 'api.request',
    params: Services.ApiServiceTypes.Actions[1]['in'],
    opts?: Broker.CallingOptions,
  ): PromiseLike<Services.ApiServiceTypes.Actions[1]['out']>;

  call(
    actionName: 'api.request',
    params: Services.ApiServiceTypes.Actions[2]['in'],
    opts?: Broker.CallingOptions,
  ): PromiseLike<Services.ApiServiceTypes.Actions[2]['out']>;

  call(
    actionName: 'api.context',
    params: Services.ApiServiceTypes.Actions[3]['in'],
    opts?: Broker.CallingOptions,
  ): PromiseLike<Services.ApiServiceTypes.Actions[3]['out']>;

  call(
    actionName: 'v1.api.request',
    params: Services.V1apiServiceTypes.Actions[0]['in'],
    opts?: Broker.CallingOptions,
  ): PromiseLike<Services.V1apiServiceTypes.Actions[0]['out']>;

  call(
    actionName: 'v1.api.context',
    params: Services.V1apiServiceTypes.Actions[1]['in'],
    opts?: Broker.CallingOptions,
  ): PromiseLike<Services.V1apiServiceTypes.Actions[1]['out']>;

  call(
    actionName: 'user.create',
    params: Services.UserServiceTypes.Actions[0]['in'],
    opts?: Broker.CallingOptions,
  ): PromiseLike<Services.UserServiceTypes.Actions[0]['out']>;

  call(
    actionName: 'user.create',
    params: Services.UserServiceTypes.Actions[1]['in'],
    opts?: Broker.CallingOptions,
  ): PromiseLike<Services.UserServiceTypes.Actions[1]['out']>;

  call(
    actionName: 'user.create',
    params: Services.UserServiceTypes.Actions[2]['in'],
    opts?: Broker.CallingOptions,
  ): PromiseLike<Services.UserServiceTypes.Actions[2]['out']>;

  call(
    actionName: 'user.get',
    params: Services.UserServiceTypes.Actions[3]['in'],
    opts?: Broker.CallingOptions,
  ): PromiseLike<Services.UserServiceTypes.Actions[3]['out']>;

  call(
    actionName: 'user.get',
    params: Services.UserServiceTypes.Actions[4]['in'],
    opts?: Broker.CallingOptions,
  ): PromiseLike<Services.UserServiceTypes.Actions[4]['out']>;

  call(
    actionName: 'user.delete',
    params: Services.UserServiceTypes.Actions[5]['in'],
    opts?: Broker.CallingOptions,
  ): PromiseLike<Services.UserServiceTypes.Actions[5]['out']>;

  emit(
    eventName: 'user.nodeChange',
    payload: Services.UserServiceTypes.Events[0]['in'],
    groups?: ServiceNamesEmitGroup,
  ): void;

  broadcast: ServiceBroker['emit'];
  broadcastLocal: ServiceBroker['emit'];
}
export type ServiceNames = never | 'api' | 'v1.api' | 'user';
export type ServiceNamesEmitGroup = ServiceNames | ServiceNames[];
export type ServiceEventNames = never | 'user.nodeChange';
