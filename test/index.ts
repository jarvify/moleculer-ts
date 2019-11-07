import { generateBrokerWatch } from '../src/utils';

generateBrokerWatch({
  serviceTypesPattern: 'test/**/*.service.types.ts',
  rootDir: process.cwd(),
  outputTypesDir: 'test/types',
});
