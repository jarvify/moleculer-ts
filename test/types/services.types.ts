import * as MoleculerTs from 'moleculer-ts';
declare module '/Users/edko/Sandbox/Jarvify/moleculer-ts/test/api.service.types' {
  type ActionParams<
    T extends MoleculerTs.GetNames<ApiServiceTypes.Actions>
  > = MoleculerTs.GetParams<ApiServiceTypes.Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<ApiServiceTypes.Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventReturn<
    T extends MoleculerTs.GetNames<ApiServiceTypes.Events>
  > = MoleculerTs.GetParams<ApiServiceTypes.Events, T>;
  type ServiceInterface = MoleculerTs.GetServiceInterface<
    ApiServiceTypes.OwnActions
  >;
}
declare module '/Users/edko/Sandbox/Jarvify/moleculer-ts/test/test.service.types' {
  type ActionParams<
    T extends MoleculerTs.GetNames<TestServiceTypes.Actions>
  > = MoleculerTs.GetParams<TestServiceTypes.Actions, T>;
  type ActionReturn<
    T extends MoleculerTs.GetNames<TestServiceTypes.Actions>
  > = MoleculerTs.GetReturn<Actions, T>;
  type EventReturn<
    T extends MoleculerTs.GetNames<TestServiceTypes.Events>
  > = MoleculerTs.GetParams<TestServiceTypes.Events, T>;
  type ServiceInterface = MoleculerTs.GetServiceInterface<
    TestServiceTypes.OwnActions
  >;
}
import * as ApiServiceTypes from '/Users/edko/Sandbox/Jarvify/moleculer-ts/test/api.service.types';
import * as TestServiceTypes from '/Users/edko/Sandbox/Jarvify/moleculer-ts/test/test.service.types';

export { ApiServiceTypes, TestServiceTypes };
