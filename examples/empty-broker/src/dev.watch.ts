import { generateBrokerWatch } from 'moleculer-ts';

const brokers = ['empty-broker'];

brokers.forEach(async broker => {
  let brokerRootDir = `${process.cwd()}/src/${broker}`;

  const watcher = await generateBrokerWatch({
    serviceTypesPattern: `${brokerRootDir}/**/*.service.types.ts`,
    outputDir: `${brokerRootDir}/types`,
  });

  watcher.on('change', filename => {
    console.log(`Generate broker ${broker}, file changed: `, filename);
  });
});
