import { generateBroker, GenerateBrokerOptions } from 'moleculer-ts';
import watch from 'glob-watcher';

const brokers = ['first.broker', 'second.broker'];

export function isWatchMode() {
  return process.argv.length >= 2 && process.argv[2] === '--watch';
}

brokers.forEach(async broker => {
  let brokerRootDir = `${process.cwd()}/src/${broker}`;
  const generateBrokerOptions: GenerateBrokerOptions = {
    serviceTypesPattern: `${brokerRootDir}/**/*.service.types.ts`,
    outputDir: `${brokerRootDir}/types`,
    generateActionsParamsAssert: true,
    generateEventsParamsAssert: true,
  };

  if (isWatchMode()) {
    const watcher = watch(
      generateBrokerOptions.serviceTypesPattern,
      async done => {
        try {
          await generateBroker(generateBrokerOptions);
        } catch (err) {
          console.error(err);
        } finally {
          done();
        }
      },
    );
    watcher.on('change', filename => {
      console.log(`Generate broker ${broker}, file changed: `, filename);
    });
  }
  console.log(`Generate broker ${broker}`);
  await generateBroker(generateBrokerOptions);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  if (!isWatchMode()) {
    process.exit(1);
  }
});
