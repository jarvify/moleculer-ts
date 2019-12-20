import { generateBrokerWatch } from 'moleculer-ts';

(async () => {
  const brokerRootDir = `${process.cwd()}/src`;

  const watcher = await generateBrokerWatch({
    serviceTypesPattern: `${brokerRootDir}/**/*.service.types.ts`,
    outputDir: `${brokerRootDir}/types`,
  });

  watcher.on('change', filename => {
    console.log(`Generate broker, file changed: `, filename);
  });
})();
