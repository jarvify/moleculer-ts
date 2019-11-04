import { generateBrokerWatch } from '../src/utils';

generateBrokerWatch({
  serviceTypesPattern: '**/*.service.types.ts',
  rootDir: process.cwd(),
  outputTypesDir: 'test/types',
});
