// import types from custom Moleculer typedef
import { Service, Context } from '../../typed-moleculer';
// import other services types
import { UserServiceTypes } from '../../types';
// use moleculer-decorators
import { Service as DService, Action } from 'moleculer-decorators';

interface UserService {
  name: typeof UserServiceTypes.name;
}
@DService({
  name: UserServiceTypes.name,
})
class UserService extends Service<{}>
  implements UserServiceTypes.ServiceOwnActions {
  @Action({
    params: {
      id: { type: 'number', positive: true, integer: true },
      name: { type: 'string', min: 3, max: 255 },
      status: 'boolean', // short-hand def
    },
  })
  async create(
    ctx: Context<UserServiceTypes.ActionParams<'create'>>,
  ): Promise<UserServiceTypes.ActionReturn<'create'>> {
    return {
      id: 'a',
    };
  }

  @Action()
  async get(
    ctx: Context<UserServiceTypes.ActionParams<'get'>>,
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
    ctx: Context<UserServiceTypes.ActionParams<'delete'>>,
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
