import * as MoleculerTs from 'moleculer-ts';
import { OwnActions as Service0Action0 } from '../services/api/api.service.types';
import { OwnEvents as Service0Event0 } from '../services/api/api.service.types';
import { OwnActions as Service1Action0 } from '../services/api/v1.api.service.types';
import { OwnEvents as Service1Event0 } from '../services/api/v1.api.service.types';
import { OwnActions as Service2Action0 } from '../services/user/user.service.types';
import { OwnEvents as Service2Event0 } from '../services/user/user.service.types';

declare module '../services/api/api.service.types' {
  type Actions = [Service0Action0[0], Service0Action0[1]];
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

declare module '../services/api/v1.api.service.types' {
  type Actions = [Service1Action0[0], Service1Action0[1]];
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

declare module '../services/user/user.service.types' {
  type Actions = [Service2Action0[0], Service2Action0[1], Service2Action0[2]];
  type Events = [Service2Event0[0]];

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

import * as ApiServiceTypes from '../services/api/api.service.types';
import * as V1apiServiceTypes from '../services/api/v1.api.service.types';
import * as UserServiceTypes from '../services/user/user.service.types';

export { ApiServiceTypes, V1apiServiceTypes, UserServiceTypes };
