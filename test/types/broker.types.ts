import {
  Service as MoleculerService,
  Context as MoleculerContext,
  ServiceBroker as MoleculerServiceBroker,
  CallingOptions,
} from 'moleculer';

import * as Services from './services.types';
export interface Broker {
  call(
    actionName: 'api.upsert',
    params: Services.ApiServiceTypes.Actions[0]['in'],
    opts?: CallingOptions,
  ): PromiseLike<Services.ApiServiceTypes.Actions[0]['out']>;

  call(
    actionName: 'api.delete',
    params: Services.ApiServiceTypes.Actions[1]['in'],
    opts?: CallingOptions,
  ): PromiseLike<Services.ApiServiceTypes.Actions[1]['out']>;

  call(
    actionName: 'test.create',
    params: Services.TestServiceTypes.Actions[0]['in'],
    opts?: CallingOptions,
  ): PromiseLike<Services.TestServiceTypes.Actions[0]['out']>;

  call(
    actionName: 'test.create',
    params: Services.TestServiceTypes.Actions[1]['in'],
    opts?: CallingOptions,
  ): PromiseLike<Services.TestServiceTypes.Actions[1]['out']>;

  call(
    actionName: 'test.create',
    params: Services.TestServiceTypes.Actions[2]['in'],
    opts?: CallingOptions,
  ): PromiseLike<Services.TestServiceTypes.Actions[2]['out']>;

  call(
    actionName: 'test.get',
    params: Services.TestServiceTypes.Actions[3]['in'],
    opts?: CallingOptions,
  ): PromiseLike<Services.TestServiceTypes.Actions[3]['out']>;

  call(
    actionName: 'test.get',
    params: Services.TestServiceTypes.Actions[4]['in'],
    opts?: CallingOptions,
  ): PromiseLike<Services.TestServiceTypes.Actions[4]['out']>;

  call(
    actionName: 'test.get',
    params: Services.TestServiceTypes.Actions[5]['in'],
    opts?: CallingOptions,
  ): PromiseLike<Services.TestServiceTypes.Actions[5]['out']>;

  emit(
    eventName: 'api.test',
    payload: Services.ApiServiceTypes.Events[0]['in'],
    groups?: ServiceNamesGroup,
  ): void;

  emit(
    eventName: 'test.test.*',
    payload: Services.TestServiceTypes.Events[0]['in'],
    groups?: ServiceNamesGroup,
  ): void;

  broadcast: Broker['emit'];
  broadcastLocal: Broker['emit'];
}
export type ServiceNames = 'api' | 'test';
export type ServiceNamesGroup = ServiceNames | ServiceNames[];
