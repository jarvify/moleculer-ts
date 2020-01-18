import * as Services from './services.types';
import { schema } from 'ts-transformer-json-schema';
type Trim<T> = { [K in keyof T]: any };

export default {
  '$broker.started': schema<
    Trim<Services.BrokerServiceTypes.EventParams<'started'>>
  >(),
  '$circuit-breaker.opened': schema<
    Trim<Services.CircuitBreakerServiceTypes.EventParams<'opened'>>
  >(),
  '$circuit-breaker.half-opened': schema<
    Trim<Services.CircuitBreakerServiceTypes.EventParams<'half-opened'>>
  >(),
  '$circuit-breaker.closed': schema<
    Trim<Services.CircuitBreakerServiceTypes.EventParams<'closed'>>
  >(),
  '$node.connected': schema<
    Trim<Services.NodeServiceTypes.EventParams<'connected'>>
  >(),
  '$node.updated': schema<
    Trim<Services.NodeServiceTypes.EventParams<'updated'>>
  >(),
  '$node.disconnected': schema<
    Trim<Services.NodeServiceTypes.EventParams<'disconnected'>>
  >(),
  '$services.changed': schema<
    Trim<Services.ServicesServiceTypes.EventParams<'changed'>>
  >(),
  '$transporter.connected': schema<
    Trim<Services.TransporterServiceTypes.EventParams<'connected'>>
  >(),
  '$transporter.disconnected': schema<
    Trim<Services.TransporterServiceTypes.EventParams<'disconnected'>>
  >(),
};
