export default {
  api: {
    request: {
      req: [{ type: 'array', items: {} }, { type: 'object' }],
      res: [{ type: 'array', items: {} }, { type: 'object' }],
    },
    context: {
      user: { type: 'object', props: { id: { type: 'string' } } },
      account: { type: 'object', props: { id: { type: 'string' } } },
    },
  },
  'v1.api': {
    request: {
      req: [{ type: 'array', items: {} }, { type: 'object' }],
      res: [{ type: 'array', items: {} }, { type: 'object' }],
    },
    context: {
      user: { type: 'object', props: { id: { type: 'string' } } },
      account: { type: 'object', props: { id: { type: 'string' } } },
    },
  },
  user: {
    create: [
      {
        type: 'object',
        props: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' },
          arr: {
            type: 'array',
            items: {
              type: 'object',
              props: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
                arr: {
                  type: 'array',
                  items: {
                    type: 'object',
                    props: {
                      id: { type: 'any' },
                      name: { type: 'any' },
                      email: { type: 'any' },
                      password: { type: 'any' },
                      arr: { type: 'array', items: { type: 'any' } },
                    },
                  },
                },
              },
            },
          },
          $info: { type: 'forbidden' },
        },
      },
      {
        type: 'object',
        props: {
          name: { type: 'string' },
          id: { type: 'forbidden' },
          email: { type: 'forbidden' },
          password: { type: 'forbidden' },
          arr: { type: 'forbidden' },
          $info: { type: 'forbidden' },
        },
      },
      {
        type: 'object',
        props: {
          name: { type: 'string' },
          $info: { type: 'string' },
          id: { type: 'forbidden' },
          email: { type: 'forbidden' },
          password: { type: 'forbidden' },
          arr: { type: 'forbidden' },
        },
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
