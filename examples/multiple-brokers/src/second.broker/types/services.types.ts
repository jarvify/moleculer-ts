import * as MoleculerTs from 'moleculer-ts';
declare module '@second.broker/services/internal/broker.service.types' {
  type ActionParams<
    T extends MoleculerTs.GetNames<BrokerServiceTypes.Actions>
  > = MoleculerTs.GetParamsStrict<BrokerServiceTypes.Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<BrokerServiceTypes.Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventParams<
    T extends MoleculerTs.GetNames<BrokerServiceTypes.Events>
  > = MoleculerTs.GetParamsStrict<BrokerServiceTypes.Events, T>;
  type ServiceInterface = MoleculerTs.GetServiceInterface<
    BrokerServiceTypes.OwnActions
  >;
}
declare module '@second.broker/services/internal/circuit-breaker.service.types' {
  type ActionParams<
    T extends MoleculerTs.GetNames<CircuitbreakerServiceTypes.Actions>
  > = MoleculerTs.GetParamsStrict<CircuitbreakerServiceTypes.Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<CircuitbreakerServiceTypes.Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventParams<
    T extends MoleculerTs.GetNames<CircuitbreakerServiceTypes.Events>
  > = MoleculerTs.GetParamsStrict<CircuitbreakerServiceTypes.Events, T>;
  type ServiceInterface = MoleculerTs.GetServiceInterface<
    CircuitbreakerServiceTypes.OwnActions
  >;
}
declare module '@second.broker/services/internal/node.service.types' {
  type ActionParams<
    T extends MoleculerTs.GetNames<NodeServiceTypes.Actions>
  > = MoleculerTs.GetParamsStrict<NodeServiceTypes.Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<NodeServiceTypes.Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventParams<
    T extends MoleculerTs.GetNames<NodeServiceTypes.Events>
  > = MoleculerTs.GetParamsStrict<NodeServiceTypes.Events, T>;
  type ServiceInterface = MoleculerTs.GetServiceInterface<
    NodeServiceTypes.OwnActions
  >;
}
declare module '@second.broker/services/internal/services.service.types' {
  type ActionParams<
    T extends MoleculerTs.GetNames<ServicesServiceTypes.Actions>
  > = MoleculerTs.GetParamsStrict<ServicesServiceTypes.Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<ServicesServiceTypes.Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventParams<
    T extends MoleculerTs.GetNames<ServicesServiceTypes.Events>
  > = MoleculerTs.GetParamsStrict<ServicesServiceTypes.Events, T>;
  type ServiceInterface = MoleculerTs.GetServiceInterface<
    ServicesServiceTypes.OwnActions
  >;
}
declare module '@second.broker/services/internal/transporter.service.types' {
  type ActionParams<
    T extends MoleculerTs.GetNames<TransporterServiceTypes.Actions>
  > = MoleculerTs.GetParamsStrict<TransporterServiceTypes.Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<TransporterServiceTypes.Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventParams<
    T extends MoleculerTs.GetNames<TransporterServiceTypes.Events>
  > = MoleculerTs.GetParamsStrict<TransporterServiceTypes.Events, T>;
  type ServiceInterface = MoleculerTs.GetServiceInterface<
    TransporterServiceTypes.OwnActions
  >;
}
declare module '@second.broker/services/test/test.service.types' {
  type ActionParams<
    T extends MoleculerTs.GetNames<TestServiceTypes.Actions>
  > = MoleculerTs.GetParamsStrict<TestServiceTypes.Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<TestServiceTypes.Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventParams<
    T extends MoleculerTs.GetNames<TestServiceTypes.Events>
  > = MoleculerTs.GetParamsStrict<TestServiceTypes.Events, T>;
  type ServiceInterface = MoleculerTs.GetServiceInterface<
    TestServiceTypes.OwnActions
  >;
}
import * as BrokerServiceTypes from '@second.broker/services/internal/broker.service.types';
import * as CircuitbreakerServiceTypes from '@second.broker/services/internal/circuit-breaker.service.types';
import * as NodeServiceTypes from '@second.broker/services/internal/node.service.types';
import * as ServicesServiceTypes from '@second.broker/services/internal/services.service.types';
import * as TransporterServiceTypes from '@second.broker/services/internal/transporter.service.types';
import * as TestServiceTypes from '@second.broker/services/test/test.service.types';

export {
  BrokerServiceTypes,
  CircuitbreakerServiceTypes,
  NodeServiceTypes,
  ServicesServiceTypes,
  TransporterServiceTypes,
  TestServiceTypes,
};
