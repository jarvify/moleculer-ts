import * as MoleculerTs from 'moleculer-ts';
import { OwnActions as Service0Action0 } from './../services/api/api.service.types';
import { SomeActions as Service0Action1 } from '@first.broker/services/api/tuple.test';
import { default as Service0Action2 } from './../services/api/./tuple.test2';
import { SomeActions3 as Service0Action3 } from './../services/api/./tuple.test2';
import { OwnEvents as Service0Event0 } from './../services/api/api.service.types';
import { OwnActions as Service1Action0 } from './../services/api/v1.api.service.types';
import { OwnEvents as Service1Event0 } from './../services/api/v1.api.service.types';
import { OwnActions as Service2Action0 } from './../services/user/user.service.types';
import { OwnEvents as Service2Event0 } from './../services/user/user.service.types';

declare module './../services/api/api.service.types' {
  type Actions = [
    Service0Action0[0],
    Service0Action0[1],
    Service0Action1[0],
    Service0Action2[0],
    Service0Action3[0],
  ];
  type Events = [];

  type ActionParams<
    T extends MoleculerTs.GetNames<ApiServiceTypes.Actions>
  > = MoleculerTs.GetParamsStrict<ApiServiceTypes.Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<ApiServiceTypes.Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventParams<
    T extends MoleculerTs.GetNames<ApiServiceTypes.Events>
  > = MoleculerTs.GetParamsStrict<ApiServiceTypes.Events, T>;
  type ServiceOwnActions = MoleculerTs.GetServiceOwnActions<
    ApiServiceTypes.OwnActions
  >;
}
declare module './../services/api/v1.api.service.types' {
  type Actions = [Service1Action0[0], Service1Action0[1]];
  type Events = [];

  type ActionParams<
    T extends MoleculerTs.GetNames<V1apiServiceTypes.Actions>
  > = MoleculerTs.GetParamsStrict<V1apiServiceTypes.Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<V1apiServiceTypes.Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventParams<
    T extends MoleculerTs.GetNames<V1apiServiceTypes.Events>
  > = MoleculerTs.GetParamsStrict<V1apiServiceTypes.Events, T>;
  type ServiceOwnActions = MoleculerTs.GetServiceOwnActions<
    V1apiServiceTypes.OwnActions
  >;
}
declare module './../services/user/user.service.types' {
  type Actions = [Service2Action0[0], Service2Action0[1], Service2Action0[2]];
  type Events = [Service2Event0[0]];

  type ActionParams<
    T extends MoleculerTs.GetNames<UserServiceTypes.Actions>
  > = MoleculerTs.GetParamsStrict<UserServiceTypes.Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<UserServiceTypes.Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventParams<
    T extends MoleculerTs.GetNames<UserServiceTypes.Events>
  > = MoleculerTs.GetParamsStrict<UserServiceTypes.Events, T>;
  type ServiceOwnActions = MoleculerTs.GetServiceOwnActions<
    UserServiceTypes.OwnActions
  >;
}
import * as ApiServiceTypes from './../services/api/api.service.types';
import * as V1apiServiceTypes from './../services/api/v1.api.service.types';
import * as UserServiceTypes from './../services/user/user.service.types';

export { ApiServiceTypes, V1apiServiceTypes, UserServiceTypes };
