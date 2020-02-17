import { Service, Action, Event, Method } from 'moleculer-decorators';
import * as Broker from '@first.broker/moleculer';
import { ApiServiceTypes, UserServiceTypes } from '@first.broker/types';

interface ApiService {
  name: typeof ApiServiceTypes.name;
}
@Service({
  name: ApiServiceTypes.name,
  mixins: [],
})
class ApiService extends Broker.Service
  implements ApiServiceTypes.ServiceOwnActions {
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
    ctx: Broker.Context<ApiServiceTypes.ActionParams<'request'>>,
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

    ctx.call('user.delete', { id: 'a' });

    return 'string';
  }

  @Action()
  async context(
    ctx: Broker.Context<ApiServiceTypes.ActionParams<'context'>>,
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
