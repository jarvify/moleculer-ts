import * as MoleculerTs from 'moleculer-ts';
declare module '../services/api/api.service.types' {
  type ActionParams<
    T extends MoleculerTs.GetNames<ApiServiceTypes.Actions>
  > = MoleculerTs.GetParamsStrict<ApiServiceTypes.Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<ApiServiceTypes.Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventParams<
    T extends MoleculerTs.GetNames<ApiServiceTypes.Events>
  > = MoleculerTs.GetParamsStrict<ApiServiceTypes.Events, T>;
  type ServiceInterface = MoleculerTs.GetServiceInterface<
    ApiServiceTypes.OwnActions
  >;
}
declare module '../services/api/v1.api.service.types' {
  type ActionParams<
    T extends MoleculerTs.GetNames<V1apiServiceTypes.Actions>
  > = MoleculerTs.GetParamsStrict<V1apiServiceTypes.Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<V1apiServiceTypes.Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventParams<
    T extends MoleculerTs.GetNames<V1apiServiceTypes.Events>
  > = MoleculerTs.GetParamsStrict<V1apiServiceTypes.Events, T>;
  type ServiceInterface = MoleculerTs.GetServiceInterface<
    V1apiServiceTypes.OwnActions
  >;
}
declare module '../services/user/user.service.types' {
  type ActionParams<
    T extends MoleculerTs.GetNames<UserServiceTypes.Actions>
  > = MoleculerTs.GetParamsStrict<UserServiceTypes.Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<UserServiceTypes.Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventParams<
    T extends MoleculerTs.GetNames<UserServiceTypes.Events>
  > = MoleculerTs.GetParamsStrict<UserServiceTypes.Events, T>;
  type ServiceInterface = MoleculerTs.GetServiceInterface<
    UserServiceTypes.OwnActions
  >;
}
import * as ApiServiceTypes from '../services/api/api.service.types';
import * as V1apiServiceTypes from '../services/api/v1.api.service.types';
import * as UserServiceTypes from '../services/user/user.service.types';

export { ApiServiceTypes, V1apiServiceTypes, UserServiceTypes };
