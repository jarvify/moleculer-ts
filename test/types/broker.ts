import {
  Service as MoleculerService,
  Context as MoleculerContext,
  ServiceBroker as MoleculerServiceBroker,
  LoggerInstance,
  GenericObject,
  Service,
} from 'moleculer';

import {
  Broker as MyBroker,
  ServiceNames,
  ServiceNamesGroup,
} from './broker.types';

import { KnownKeys } from 'src';

// also strip [key: string]: any
type StripMoleculerServiceBrokerKeys =
  | 'getLocalService'
  | 'waitForServices'
  | 'call'
  | 'emit'
  | 'broadcast'
  | 'broadcastLocal';

type StripBroker = Omit<
  Pick<MoleculerServiceBroker, KnownKeys<MoleculerServiceBroker>>,
  StripMoleculerServiceBrokerKeys
>;

export interface Broker extends StripBroker, MyBroker {
  getLocalService(
    serviceName: ServiceNames,
    version?: string | number,
  ): Service;

  waitForServices(
    serviceNames: ServiceNamesGroup | Array<GenericObject>,
    timeout?: number,
    interval?: number,
    logger?: LoggerInstance,
  ): PromiseLike<void>;
}

export const Broker: Broker = (MoleculerServiceBroker as unknown) as Broker;


let B: Broker;


B.broadcast('test.test.*', )
B.call('test.create', {});

B.call(, { age: 10 });
B.emit('test.test', { age: 10 });
