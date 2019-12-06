import * as MoleculerTs from 'moleculer-ts';
import * as Broker from './moleculer';
import * as Services from './services.types';

type StrictObject<P, A> = A & { [K in Exclude<keyof P, keyof A>]: never };

type PickByParam<P, A> = {
  [K in keyof P]: K extends keyof A ? A[K] : never;
};

export interface ServiceBroker {
  call<T extends ServiceActionNames, P extends GetCallParams<P>[T]>(
    actionName: T,
    params: P,
    opts?: Broker.CallingOptions,
  ): PromiseLike<GetCallReturn<P>[T]>;

  emit<T extends ServiceEventNames, P extends GetEmitParams<P>[T]>(
    eventName: T,
    payload: P,
    groups?: ServiceNamesEmitGroup,
  ): void;

  broadcast: ServiceBroker['emit'];
  broadcastLocal: ServiceBroker['emit'];
}

type GetCallParams<P> = {};
type GetCallReturn<P> = {};
type GetEmitParams<P> = {};
export type ServiceNames = Exclude<never, never>;
export type ServiceNamesEmitGroup = ServiceNames | ServiceNames[];
export type ServiceEventNames = Exclude<never, never>;
export type ServiceActionNames = Exclude<never, never>;
