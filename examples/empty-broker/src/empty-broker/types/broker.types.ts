import * as Broker from './moleculer';
import * as Services from './services.types';
export interface ServiceBroker {
  call(actionName: never): never;
  emit(actionName: never): never;

  broadcast: ServiceBroker['emit'];
  broadcastLocal: ServiceBroker['emit'];
}
export type ServiceNames = never;
export type ServiceNamesEmitGroup = ServiceNames | ServiceNames[];
export type ServiceEventNames = never;
