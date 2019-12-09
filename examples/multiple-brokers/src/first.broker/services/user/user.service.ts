import { Service, Action, Event, Method } from 'moleculer-decorators';
import * as Broker from '@first.broker/moleculer';
import { UserServiceTypes } from '@first.broker/types';

interface UserService {
  name: typeof UserServiceTypes.name;
}
@Service({
  name: UserServiceTypes.name,
})
class UserService extends Broker.Service<{}>
  implements UserServiceTypes.ServiceOwnActions {
  @Action({
    params: {
      id: { type: 'number', positive: true, integer: true },
      name: { type: 'string', min: 3, max: 255 },
      status: 'boolean', // short-hand def
    },
  })
  async create(
    ctx: Broker.Context<UserServiceTypes.ActionParams<'create'>>,
  ): Promise<UserServiceTypes.ActionReturn<'create'>> {
    return {
      id: 'a',
    };
  }

  @Action()
  async get(
    ctx: Broker.Context<UserServiceTypes.ActionParams<'get'>>,
  ): Promise<UserServiceTypes.ActionReturn<'get'>> {
    const params = ctx.params;

    return {
      email: 'a',
      id: 'a',
      name: 'a',
      password: 'a',
    };
  }

  @Action()
  async delete(
    ctx: Broker.Context<UserServiceTypes.ActionParams<'delete'>>,
  ): Promise<UserServiceTypes.ActionReturn<'delete'>> {
    const params = ctx.params;
    return {
      email: 'a',
      id: 'a',
      name: 'a',
      password: 'a',
    };
  }

  created() {
    this.waitForServices(['api']);
    this.waitForServices('api');
    this.waitForServices([{ name: 'api' }]);
  }
}

export = UserService;
