// import types from custom Moleculer typedef
import { Service, Context, eventName } from '../../typed-moleculer';
// import other services types
import { UserServiceTypes, V1ApiServiceTypes } from '../../types';
// use moleculer-decorators
import { Service as DService, Action, Event } from 'moleculer-decorators';

interface V1ApiService {
  name: 'api';
}
@DService({
  name: 'api',
  version: 'v1',
  mixins: [],
})
class V1ApiService extends Service<{}>
  implements V1ApiServiceTypes.ServiceOwnActions {
  settings: any;
  @Event({
    name: eventName('user.nodeChange'),
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
    ctx: Context<V1ApiServiceTypes.ActionParams<'request'>>,
  ): Promise<V1ApiServiceTypes.ActionReturn<'request'>> {
    const params = ctx.params;
    params.req;
    params.res;

    ctx.call('user.delete', { id: 'a' });

    return 'string';
  }

  @Action()
  async context(
    ctx: Context<V1ApiServiceTypes.ActionParams<'context'>>,
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
