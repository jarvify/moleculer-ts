export default {
  api: {
    request: { req: { type: 'any' }, res: { type: 'any' } },
    context: {
      user: { type: 'object', props: { id: { type: 'string' } } },
      account: { type: 'object', props: { id: { type: 'string' } } },
    },
  },
  'v1.api': {
    request: { req: { type: 'any' }, res: { type: 'any' } },
    context: {
      user: { type: 'object', props: { id: { type: 'string' } } },
      account: { type: 'object', props: { id: { type: 'string' } } },
    },
  },
  user: {
    create: [
      {
        type: 'object',
        props: { name: { type: 'string' }, $info: { type: 'forbidden' } },
      },
      {
        type: 'object',
        props: { name: { type: 'string' }, $info: { type: 'string' } },
      },
    ],
    get: [
      {
        type: 'object',
        props: { id: { type: 'string' }, email: { type: 'forbidden' } },
      },
      {
        type: 'object',
        props: { email: { type: 'string' }, id: { type: 'forbidden' } },
      },
    ],
    delete: { id: { type: 'string' } },
  },
};
