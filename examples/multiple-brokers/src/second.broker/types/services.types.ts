import * as MoleculerTs from 'moleculer-ts';
import { OwnActions as Service0Action0 } from '../services/internal/broker.service.types';
import { OwnEvents as Service0Event0 } from '../services/internal/broker.service.types';
import { OwnActions as Service1Action0 } from '../services/internal/circuit-breaker.service.types';
import { OwnEvents as Service1Event0 } from '../services/internal/circuit-breaker.service.types';
import { OwnActions as Service2Action0 } from '../services/internal/node.service.types';
import { OwnEvents as Service2Event0 } from '../services/internal/node.service.types';
import { OwnActions as Service3Action0 } from '../services/internal/services.service.types';
import { OwnEvents as Service3Event0 } from '../services/internal/services.service.types';
import { OwnActions as Service4Action0 } from '../services/internal/transporter.service.types';
import { OwnEvents as Service4Event0 } from '../services/internal/transporter.service.types';
import { OwnActions as Service5Action0 } from '../services/test/test.service.types';
import { OwnEvents as Service5Event0 } from '../services/test/test.service.types';

declare module '../services/internal/broker.service.types' {
  type Actions = [];
  type Events = [Service0Event0[0]];

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
  type Actions = [];
  type Events = [Service1Event0[0], Service1Event0[1], Service1Event0[2]];

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
  type Actions = [];
  type Events = [Service2Event0[0], Service2Event0[1], Service2Event0[2]];

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
  type Actions = [];
  type Events = [Service3Event0[0]];

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
  type Actions = [];
  type Events = [Service4Event0[0], Service4Event0[1]];

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
  type Actions = [];
  type Events = [];

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
