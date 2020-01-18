import * as Services from './services.types';
import { schema } from 'ts-transformer-json-schema';
type Trim<T> = { [K in keyof T]: any };

export default {
  'api.request': schema<
    Trim<Services.ApiServiceTypes.ActionParams<'request'>>
  >(),
  'api.context': schema<
    Trim<Services.ApiServiceTypes.ActionParams<'context'>>
  >(),
  'v1.api.request': schema<
    Trim<Services.V1ApiServiceTypes.ActionParams<'request'>>
  >(),
  'v1.api.context': schema<
    Trim<Services.V1ApiServiceTypes.ActionParams<'context'>>
  >(),
  'user.create': schema<
    Trim<Services.UserServiceTypes.ActionParams<'create'>>
  >(),
  'user.get': schema<Trim<Services.UserServiceTypes.ActionParams<'get'>>>(),
  'user.delete': schema<
    Trim<Services.UserServiceTypes.ActionParams<'delete'>>
  >(),
};
