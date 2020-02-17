import { Service, Action, Event, Method } from 'moleculer-decorators';
import * as Broker from '@first.broker/moleculer';
import { UserServiceTypes, V1ApiServiceTypes } from '@first.broker/types';

interface V1ApiService {
  name: 'api';
}
@Service({
  name: 'api',
  version: 'v1',
  mixins: [],
})
class V1ApiService extends Broker.Service<{}>
  implements V1ApiServiceTypes.ServiceOwnActions {
  settings: any;
  @Event({
    name: Broker.eventName('user.nodeChange'),
  })
  someEvent(payload: UserServiceTypes.EventParams<'nodeChange'>) {
    payload.id;
    payload.email;
    payload.password;
    payload.name;

    this.broker.emit('user.nodeChange', payload);
  }

  @Action()
  async request(
    ctx: Broker.Context<V1ApiServiceTypes.ActionParams<'request'>>,
  ): Promise<V1ApiServiceTypes.ActionReturn<'request'>> {
    const params = ctx.params;
    params.req;
    params.res;

    ctx.call('user.delete', { id: 'a' });

    return 'string';
  }

  @Action()
  async context(
    ctx: Broker.Context<V1ApiServiceTypes.ActionParams<'context'>>,
  ): Promise<V1ApiServiceTypes.ActionReturn<'context'>> {
    const params = ctx.params;
    params.account.id;
    params.user.id;

    return 10;
  }

  created() {
    this.waitForServices(['api', 'user']);
  }
}

export = V1ApiService;
