import * as MoleculerTs from 'moleculer-ts';
declare module './../services/internal/broker.service.types' {
  type ActionParams<
    T extends MoleculerTs.GetNames<BrokerServiceTypes.Actions>
  > = MoleculerTs.GetParamsStrict<BrokerServiceTypes.Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<BrokerServiceTypes.Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventParams<
    T extends MoleculerTs.GetNames<BrokerServiceTypes.Events>
  > = MoleculerTs.GetParamsStrict<BrokerServiceTypes.Events, T>;
  type ServiceOwnActions = MoleculerTs.GetServiceOwnActions<
    BrokerServiceTypes.OwnActions
  >;
}
declare module './../services/internal/circuit-breaker.service.types' {
  type ActionParams<
    T extends MoleculerTs.GetNames<CircuitbreakerServiceTypes.Actions>
  > = MoleculerTs.GetParamsStrict<CircuitbreakerServiceTypes.Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<CircuitbreakerServiceTypes.Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventParams<
    T extends MoleculerTs.GetNames<CircuitbreakerServiceTypes.Events>
  > = MoleculerTs.GetParamsStrict<CircuitbreakerServiceTypes.Events, T>;
  type ServiceOwnActions = MoleculerTs.GetServiceOwnActions<
    CircuitbreakerServiceTypes.OwnActions
  >;
}
declare module './../services/internal/node.service.types' {
  type ActionParams<
    T extends MoleculerTs.GetNames<NodeServiceTypes.Actions>
  > = MoleculerTs.GetParamsStrict<NodeServiceTypes.Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<NodeServiceTypes.Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventParams<
    T extends MoleculerTs.GetNames<NodeServiceTypes.Events>
  > = MoleculerTs.GetParamsStrict<NodeServiceTypes.Events, T>;
  type ServiceOwnActions = MoleculerTs.GetServiceOwnActions<
    NodeServiceTypes.OwnActions
  >;
}
declare module './../services/internal/services.service.types' {
  type ActionParams<
    T extends MoleculerTs.GetNames<ServicesServiceTypes.Actions>
  > = MoleculerTs.GetParamsStrict<ServicesServiceTypes.Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<ServicesServiceTypes.Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventParams<
    T extends MoleculerTs.GetNames<ServicesServiceTypes.Events>
  > = MoleculerTs.GetParamsStrict<ServicesServiceTypes.Events, T>;
  type ServiceOwnActions = MoleculerTs.GetServiceOwnActions<
    ServicesServiceTypes.OwnActions
  >;
}
declare module './../services/internal/transporter.service.types' {
  type ActionParams<
    T extends MoleculerTs.GetNames<TransporterServiceTypes.Actions>
  > = MoleculerTs.GetParamsStrict<TransporterServiceTypes.Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<TransporterServiceTypes.Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventParams<
    T extends MoleculerTs.GetNames<TransporterServiceTypes.Events>
  > = MoleculerTs.GetParamsStrict<TransporterServiceTypes.Events, T>;
  type ServiceOwnActions = MoleculerTs.GetServiceOwnActions<
    TransporterServiceTypes.OwnActions
  >;
}
declare module './../services/test/test.service.types' {
  type ActionParams<
    T extends MoleculerTs.GetNames<TestServiceTypes.Actions>
  > = MoleculerTs.GetParamsStrict<TestServiceTypes.Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<TestServiceTypes.Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventParams<
    T extends MoleculerTs.GetNames<TestServiceTypes.Events>
  > = MoleculerTs.GetParamsStrict<TestServiceTypes.Events, T>;
  type ServiceOwnActions = MoleculerTs.GetServiceOwnActions<
    TestServiceTypes.OwnActions
  >;
}
import * as BrokerServiceTypes from './../services/internal/broker.service.types';
import * as CircuitbreakerServiceTypes from './../services/internal/circuit-breaker.service.types';
import * as NodeServiceTypes from './../services/internal/node.service.types';
import * as ServicesServiceTypes from './../services/internal/services.service.types';
import * as TransporterServiceTypes from './../services/internal/transporter.service.types';
import * as TestServiceTypes from './../services/test/test.service.types';

export {
  BrokerServiceTypes,
  CircuitbreakerServiceTypes,
  NodeServiceTypes,
  ServicesServiceTypes,
  TransporterServiceTypes,
  TestServiceTypes,
};
