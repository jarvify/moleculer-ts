import * as MoleculerTs from 'moleculer-ts';

declare module '../services/internal/broker.service.types' {
  type ActionParams<
    T extends MoleculerTs.GetNames<Actions>
  > = MoleculerTs.GetParamsStrict<Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventParams<
    T extends MoleculerTs.GetNames<Events>
  > = MoleculerTs.GetParamsStrict<Events, T>;
  type ServiceOwnActions = MoleculerTs.GetServiceOwnActions<OwnActions>;
}

declare module '../services/internal/circuit-breaker.service.types' {
  type ActionParams<
    T extends MoleculerTs.GetNames<Actions>
  > = MoleculerTs.GetParamsStrict<Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventParams<
    T extends MoleculerTs.GetNames<Events>
  > = MoleculerTs.GetParamsStrict<Events, T>;
  type ServiceOwnActions = MoleculerTs.GetServiceOwnActions<OwnActions>;
}

declare module '../services/internal/node.service.types' {
  type ActionParams<
    T extends MoleculerTs.GetNames<Actions>
  > = MoleculerTs.GetParamsStrict<Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventParams<
    T extends MoleculerTs.GetNames<Events>
  > = MoleculerTs.GetParamsStrict<Events, T>;
  type ServiceOwnActions = MoleculerTs.GetServiceOwnActions<OwnActions>;
}

declare module '../services/internal/services.service.types' {
  type ActionParams<
    T extends MoleculerTs.GetNames<Actions>
  > = MoleculerTs.GetParamsStrict<Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventParams<
    T extends MoleculerTs.GetNames<Events>
  > = MoleculerTs.GetParamsStrict<Events, T>;
  type ServiceOwnActions = MoleculerTs.GetServiceOwnActions<OwnActions>;
}

declare module '../services/internal/transporter.service.types' {
  type ActionParams<
    T extends MoleculerTs.GetNames<Actions>
  > = MoleculerTs.GetParamsStrict<Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventParams<
    T extends MoleculerTs.GetNames<Events>
  > = MoleculerTs.GetParamsStrict<Events, T>;
  type ServiceOwnActions = MoleculerTs.GetServiceOwnActions<OwnActions>;
}

declare module '../services/test/test.service.types' {
  type ActionParams<
    T extends MoleculerTs.GetNames<Actions>
  > = MoleculerTs.GetParamsStrict<Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventParams<
    T extends MoleculerTs.GetNames<Events>
  > = MoleculerTs.GetParamsStrict<Events, T>;
  type ServiceOwnActions = MoleculerTs.GetServiceOwnActions<OwnActions>;
}

import * as BrokerServiceTypes from '../services/internal/broker.service.types';
import * as CircuitbreakerServiceTypes from '../services/internal/circuit-breaker.service.types';
import * as NodeServiceTypes from '../services/internal/node.service.types';
import * as ServicesServiceTypes from '../services/internal/services.service.types';
import * as TransporterServiceTypes from '../services/internal/transporter.service.types';
import * as TestServiceTypes from '../services/test/test.service.types';

export {
  BrokerServiceTypes,
  CircuitbreakerServiceTypes,
  NodeServiceTypes,
  ServicesServiceTypes,
  TransporterServiceTypes,
  TestServiceTypes,
};
