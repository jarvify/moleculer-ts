import * as Services from './services.types';
import { schema } from 'ts-transformer-json-schema';
type Trim<T> = { [K in keyof T]: any };

export default {
  'user.nodeChange': schema<
    Trim<Services.UserServiceTypes.EventParams<'nodeChange'>>
  >(),
};
