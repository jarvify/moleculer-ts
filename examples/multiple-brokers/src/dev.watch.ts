import { generateBrokerWatch, generateBroker } from 'moleculer-ts';
import { setInterval } from 'timers';

const brokers = ['first.broker', 'second.broker'];

brokers.forEach(async broker => {
  let brokerRootDir = `${process.cwd()}/src/${broker}`;

  setInterval(async () => {
    await generateBroker({
      serviceTypesPattern: `${brokerRootDir}/**/*.service.types.ts`,
      outputDir: `${brokerRootDir}/types`,
    });
  }, 5000);
});
