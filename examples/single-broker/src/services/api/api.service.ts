// import types from custom Moleculer typedef
import { Service, Context, eventName } from '../../typed-moleculer';
// import other services types
import { ApiServiceTypes, UserServiceTypes } from '../../types';
// use moleculer-decorators
import { Service as DService, Action, Event } from 'moleculer-decorators';

interface ApiService {
  name: typeof ApiServiceTypes.name;
}
@DService({
  name: ApiServiceTypes.name,
  mixins: [],
})
class ApiService extends Service
  implements ApiServiceTypes.ServiceOwnActions {
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
    ctx: Context<ApiServiceTypes.ActionParams<'request'>>,
  ): Promise<ApiServiceTypes.ActionReturn<'request'>> {
    const params = ctx.params;
    params.req;
    params.res;

    const a = await ctx.call('user.create', {
      email: 'a',
      id: 'a',
      name: 'a',
      password: 'a',
    });

    await ctx.call('user.delete', { id: 'a' });

    return 'string';
  }

  @Action()
  async context(
    ctx: Context<ApiServiceTypes.ActionParams<'context'>>,
  ): Promise<ApiServiceTypes.ActionReturn<'context'>> {
    const params = ctx.params;
    params.account.id;
    params.user.id;

    return 10;
  }

  created() {
    // this.broker.call('user.create', { name: 'a' });
    this.waitForServices(['api', 'user']);
  }
}

export = ApiService;
