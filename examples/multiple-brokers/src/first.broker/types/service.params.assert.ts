import * as Services from './services.types';
import { createAssertEquals, createAssertType } from 'typescript-is';

export default {
  'api.request': {
    equals: createAssertType<
      Services.ApiServiceTypes.ActionParams<'request'>
    >(),
    type: createAssertType<Services.ApiServiceTypes.ActionParams<'request'>>(),
  },
  'api.context': {
    equals: createAssertType<
      Services.ApiServiceTypes.ActionParams<'context'>
    >(),
    type: createAssertType<Services.ApiServiceTypes.ActionParams<'context'>>(),
  },
  'v1.api.request': {
    equals: createAssertType<
      Services.V1ApiServiceTypes.ActionParams<'request'>
    >(),
    type: createAssertType<
      Services.V1ApiServiceTypes.ActionParams<'request'>
    >(),
  },
  'v1.api.context': {
    equals: createAssertType<
      Services.V1ApiServiceTypes.ActionParams<'context'>
    >(),
    type: createAssertType<
      Services.V1ApiServiceTypes.ActionParams<'context'>
    >(),
  },
  'user.create': {
    equals: createAssertType<
      Services.UserServiceTypes.ActionParams<'create'>
    >(),
    type: createAssertType<Services.UserServiceTypes.ActionParams<'create'>>(),
  },
  'user.get': {
    equals: createAssertType<Services.UserServiceTypes.ActionParams<'get'>>(),
    type: createAssertType<Services.UserServiceTypes.ActionParams<'get'>>(),
  },
  'user.delete': {
    equals: createAssertType<
      Services.UserServiceTypes.ActionParams<'delete'>
    >(),
    type: createAssertType<Services.UserServiceTypes.ActionParams<'delete'>>(),
  },
};
