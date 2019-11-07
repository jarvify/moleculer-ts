import * as MoleculerTs from 'moleculer-ts';
declare module '@first.broker/services/api/api.service.types' {
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
declare module '@first.broker/services/user/user.service.types' {
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
import * as ApiServiceTypes from '@first.broker/services/api/api.service.types';
import * as UserServiceTypes from '@first.broker/services/user/user.service.types';

export { ApiServiceTypes, UserServiceTypes };
