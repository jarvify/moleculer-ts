import * as Services from './services.types';
import { createAssertEquals, createAssertType } from 'typescript-is';

export default {
  'user.nodeChange': {
    equals: createAssertEquals<
      Services.UserServiceTypes.EventParams<'nodeChange'>
    >(),
    type: createAssertType<
      Services.UserServiceTypes.EventParams<'nodeChange'>
    >(),
  },
};
