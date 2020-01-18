import * as Services from './services.types';
import { createAssertEquals, createAssertType } from 'typescript-is';

export default {
  '$broker.started': {
    equals: createAssertEquals<
      Services.BrokerServiceTypes.EventParams<'started'>
    >(),
    type: createAssertType<
      Services.BrokerServiceTypes.EventParams<'started'>
    >(),
  },
  '$circuit-breaker.opened': {
    equals: createAssertEquals<
      Services.CircuitBreakerServiceTypes.EventParams<'opened'>
    >(),
    type: createAssertType<
      Services.CircuitBreakerServiceTypes.EventParams<'opened'>
    >(),
  },
  '$circuit-breaker.half-opened': {
    equals: createAssertEquals<
      Services.CircuitBreakerServiceTypes.EventParams<'half-opened'>
    >(),
    type: createAssertType<
      Services.CircuitBreakerServiceTypes.EventParams<'half-opened'>
    >(),
  },
  '$circuit-breaker.closed': {
    equals: createAssertEquals<
      Services.CircuitBreakerServiceTypes.EventParams<'closed'>
    >(),
    type: createAssertType<
      Services.CircuitBreakerServiceTypes.EventParams<'closed'>
    >(),
  },
  '$node.connected': {
    equals: createAssertEquals<
      Services.NodeServiceTypes.EventParams<'connected'>
    >(),
    type: createAssertType<
      Services.NodeServiceTypes.EventParams<'connected'>
    >(),
  },
  '$node.updated': {
    equals: createAssertEquals<
      Services.NodeServiceTypes.EventParams<'updated'>
    >(),
    type: createAssertType<Services.NodeServiceTypes.EventParams<'updated'>>(),
  },
  '$node.disconnected': {
    equals: createAssertEquals<
      Services.NodeServiceTypes.EventParams<'disconnected'>
    >(),
    type: createAssertType<
      Services.NodeServiceTypes.EventParams<'disconnected'>
    >(),
  },
  '$services.changed': {
    equals: createAssertEquals<
      Services.ServicesServiceTypes.EventParams<'changed'>
    >(),
    type: createAssertType<
      Services.ServicesServiceTypes.EventParams<'changed'>
    >(),
  },
  '$transporter.connected': {
    equals: createAssertEquals<
      Services.TransporterServiceTypes.EventParams<'connected'>
    >(),
    type: createAssertType<
      Services.TransporterServiceTypes.EventParams<'connected'>
    >(),
  },
  '$transporter.disconnected': {
    equals: createAssertEquals<
      Services.TransporterServiceTypes.EventParams<'disconnected'>
    >(),
    type: createAssertType<
      Services.TransporterServiceTypes.EventParams<'disconnected'>
    >(),
  },
};
