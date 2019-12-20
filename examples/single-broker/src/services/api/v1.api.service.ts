// import types from custom Moleculer typedef
import { Service, Context, eventName } from '../../typed-moleculer';
// import other services types
import { UserServiceTypes, V1apiServiceTypes } from '../../types';
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
  implements V1apiServiceTypes.ServiceOwnActions {
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
    ctx: Context<V1apiServiceTypes.ActionParams<'request'>>,
  ): Promise<V1apiServiceTypes.ActionReturn<'request'>> {
    const params = ctx.params;
    params.req;
    params.res;


    ctx.call('user.delete', { id: 'a' });

    return 'string';
  }

  @Action()
  async context(
    ctx: Context<V1apiServiceTypes.ActionParams<'context'>>,
  ): Promise<V1apiServiceTypes.ActionReturn<'context'>> {
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
