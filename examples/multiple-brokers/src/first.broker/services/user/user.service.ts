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
  implements UserServiceTypes.ServiceInterface {
  @Action()
  async create(
    ctx: Broker.Context<UserServiceTypes.ActionParams<'create'>>,
  ): Promise<UserServiceTypes.ActionReturn<'create'>> {
    if (0) {
      return 10;
    }

    if (1) {
      return {
        name: 'a',
      };
    }

    return {
      id: 'a',
      email: 'a',
      password: 'a',
      name: 'a',
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
