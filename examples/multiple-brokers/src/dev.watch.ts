import { generateBrokerWatch } from 'moleculer-ts';

const brokers = ['second.broker'];

brokers.forEach(async broker => {
  let rootDir = `${process.cwd()}/src/${broker}`;
  console.log(rootDir);

  const watcher = await generateBrokerWatch({
    serviceTypesPattern: `${rootDir}/**/*.service.types.ts`,
    rootDir,
    rootDirAlias: `@${broker}`,
    outputDir: `types`,
    moleculer: `moleculer`,
  });

  watcher.on('change', filename => {
    console.log(`Generate broker ${broker}, file changed: `, filename);
  });
});
