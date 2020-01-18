import * as Services from './services.types';
import { createAssertEquals, createAssertType } from 'typescript-is';

export default {
  'api.request': {
    equals: createAssertEquals<
      Services.ApiServiceTypes.ActionParams<'request'>
    >(),
    type: createAssertType<Services.ApiServiceTypes.ActionParams<'request'>>(),
  },
  'api.context': {
    equals: createAssertEquals<
      Services.ApiServiceTypes.ActionParams<'context'>
    >(),
    type: createAssertType<Services.ApiServiceTypes.ActionParams<'context'>>(),
  },
  'v1.api.request': {
    equals: createAssertEquals<
      Services.V1ApiServiceTypes.ActionParams<'request'>
    >(),
    type: createAssertType<
      Services.V1ApiServiceTypes.ActionParams<'request'>
    >(),
  },
  'v1.api.context': {
    equals: createAssertEquals<
      Services.V1ApiServiceTypes.ActionParams<'context'>
    >(),
    type: createAssertType<
      Services.V1ApiServiceTypes.ActionParams<'context'>
    >(),
  },
  'user.create': {
    equals: createAssertEquals<
      Services.UserServiceTypes.ActionParams<'create'>
    >(),
    type: createAssertType<Services.UserServiceTypes.ActionParams<'create'>>(),
  },
  'user.get': {
    equals: createAssertEquals<Services.UserServiceTypes.ActionParams<'get'>>(),
    type: createAssertType<Services.UserServiceTypes.ActionParams<'get'>>(),
  },
  'user.delete': {
    equals: createAssertEquals<
      Services.UserServiceTypes.ActionParams<'delete'>
    >(),
    type: createAssertType<Services.UserServiceTypes.ActionParams<'delete'>>(),
  },
};
