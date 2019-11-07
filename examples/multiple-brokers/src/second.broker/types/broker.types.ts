import * as Broker from '@second.broker/moleculer';

import * as Services from './services.types';
export interface ServiceBroker {
  call(actionName: never): never;
  emit(actionName: never): never;

  emit(
    eventName: '$broker.started',
    payload: Services.BrokerServiceTypes.Events[0]['in'],
    groups?: ServiceNamesEmitGroup,
  ): void;

  emit(
    eventName: '$circuit-breaker.opened',
    payload: Services.CircuitbreakerServiceTypes.Events[0]['in'],
    groups?: ServiceNamesEmitGroup,
  ): void;

  emit(
    eventName: '$circuit-breaker.half-opened',
    payload: Services.CircuitbreakerServiceTypes.Events[1]['in'],
    groups?: ServiceNamesEmitGroup,
  ): void;

  emit(
    eventName: '$circuit-breaker.closed',
    payload: Services.CircuitbreakerServiceTypes.Events[2]['in'],
    groups?: ServiceNamesEmitGroup,
  ): void;

  emit(
    eventName: '$node.connected',
    payload: Services.NodeServiceTypes.Events[0]['in'],
    groups?: ServiceNamesEmitGroup,
  ): void;

  emit(
    eventName: '$node.updated',
    payload: Services.NodeServiceTypes.Events[1]['in'],
    groups?: ServiceNamesEmitGroup,
  ): void;

  emit(
    eventName: '$node.disconnected',
    payload: Services.NodeServiceTypes.Events[2]['in'],
    groups?: ServiceNamesEmitGroup,
  ): void;

  emit(
    eventName: '$services.changed',
    payload: Services.ServicesServiceTypes.Events[0]['in'],
    groups?: ServiceNamesEmitGroup,
  ): void;

  emit(
    eventName: '$transporter.connected',
    payload: Services.TransporterServiceTypes.Events[0]['in'],
    groups?: ServiceNamesEmitGroup,
  ): void;

  emit(
    eventName: '$transporter.disconnected',
    payload: Services.TransporterServiceTypes.Events[1]['in'],
    groups?: ServiceNamesEmitGroup,
  ): void;

  broadcast: ServiceBroker['emit'];
  broadcastLocal: ServiceBroker['emit'];
}
export type ServiceNames =
  | never
  | '$broker'
  | '$circuit-breaker'
  | '$node'
  | '$services'
  | '$transporter'
  | 'test';
export type ServiceNamesEmitGroup = ServiceNames | ServiceNames[];
export type ServiceEventNames =
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
  | '$transporter.disconnected';
