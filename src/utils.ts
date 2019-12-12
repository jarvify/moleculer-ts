import prettier from 'prettier';
import fs from 'fs';
import watch from 'glob-watcher';
import glob from 'glob';
import path from 'path';
import cp from 'child_process';
import Mustache from 'mustache';

type GenerateBrokerOptions = {
  serviceTypesPattern: string;
  outputDir: string;
  isServiceName?: (name: string) => boolean;
};

const capitalize = (s: string) => {
  if (typeof s !== 'string') {
    return '';
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const serviceTemplate = fs.readFileSync(
  path.join(__dirname, 'templates', 'service.ts.mustache'),
  'utf-8',
);
const brokerTemplate = fs.readFileSync(
  path.join(__dirname, 'templates', 'broker.ts.mustache'),
  'utf-8',
);

async function formatAndSave(input: string, destination: string) {
  const info = await prettier.getFileInfo(destination);

  const options = (await prettier.resolveConfig(destination)) || undefined;
  if (options) {
    options.parser = info.inferredParser as prettier.Options['parser'];
  }

  const output = prettier.format(input, options);
  await new Promise((resolve, reject) => {
    fs.mkdir(path.dirname(destination), { recursive: true }, err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
  await new Promise((resolve, reject) => {
    fs.writeFile(destination, output, err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

function getServiceTypeName(name: string) {
  const pureName = name.replace(/[^a-zA-Z0-9]/g, '');
  return `${capitalize(pureName)}ServiceTypes`;
}

function getRelativePathForImport(from: string, to: string) {
  return path.posix
    .relative(path.posix.normalize(from), path.posix.normalize(to))
    .replace(/\.ts$/, '');
}

async function rawMetaNames(services: any[], outputDirImport: string) {
  // broker type file gen
  let cpMetaFile = ``;
  cpMetaFile += `
    import * as Services from '${outputDirImport}/services.types';
    import { enumerate } from 'ts-transformer-enumerate';
    import * as MoleculerTs from 'moleculer-ts'\n;
  `;

  cpMetaFile += 'const meta: any = {';
  services.forEach(svc => {
    cpMetaFile += `'${getServiceTypeName(
      svc.name,
    )}': { actionsLength: Object.keys(enumerate<MoleculerTs.GetAllNameKeysAndLength<Services.${getServiceTypeName(
      svc.name,
    )}.Actions>>()).length -1, eventsLength: Object.keys(enumerate<MoleculerTs.GetAllNameKeysAndLength<Services.${getServiceTypeName(
      svc.name,
    )}.Events>>()).length -1, actionsEnum: enumerate<MoleculerTs.GetNames<Services.${getServiceTypeName(
      svc.name,
    )}.Actions>>() },`;
  });

  cpMetaFile += '}\n';

  cpMetaFile += 'console.log(JSON.stringify(meta));';

  const cpMeta = cp.spawn(`${path.join('node_modules', '.bin', 'ts-node')}`, [
    '-e',
    cpMetaFile,
  ]);

  let rawMeta = '';

  cpMeta.stdout.on('data', data => {
    rawMeta += data;
  });

  cpMeta.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
  });

  await new Promise(resolve => {
    cpMeta.on('close', code => {
      resolve();
    });
  });

  const meta = JSON.parse(rawMeta);

  // broker action names
  let cpMetaNamesFile = ``;
  cpMetaNamesFile += `
    import * as Services from '${outputDirImport}/services.types';
    import { enumerate } from 'ts-transformer-enumerate';
    import * as MoleculerTs from 'moleculer-ts'\n;
  `;

  cpMetaNamesFile += 'const meta: any = {';
  services.forEach(svc => {
    Array(meta[getServiceTypeName(svc.name)].actionsLength)
      .fill(0)
      .forEach((_, index) => {
        cpMetaNamesFile += `Services${getServiceTypeName(
          svc.name,
        )}ActionsName${index}: Object.keys(enumerate<Services.${getServiceTypeName(
          svc.name,
        )}.Actions[${index}]['name']>())[0],`;
      });

    Array(meta[getServiceTypeName(svc.name)].eventsLength)
      .fill(0)
      .forEach((_, index) => {
        cpMetaNamesFile += `Services${getServiceTypeName(
          svc.name,
        )}EventsName${index}: Object.keys(enumerate<Services.${getServiceTypeName(
          svc.name,
        )}.Events[${index}]['name']>())[0],`;
      });
  });

  cpMetaNamesFile += '}\n';

  cpMetaNamesFile += 'console.log(JSON.stringify(meta));';

  const cpMetaNames = cp.spawn(
    `${path.join('node_modules', '.bin', 'ts-node')}`,
    ['-e', cpMetaNamesFile],
  );

  let rawMetaNames = '';

  cpMetaNames.stdout.on('data', data => {
    rawMetaNames += data;
  });

  cpMetaNames.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
  });

  await new Promise(resolve => {
    cpMetaNames.on('close', code => {
      resolve();
    });
  });

  return {
    meta,
    rawMetaNames: JSON.parse(rawMetaNames),
  };
}

export async function generateBroker(options: GenerateBrokerOptions) {
  const isServiceName =
    options.isServiceName ||
    function(name: string) {
      return !Boolean(name.match(/^\$/));
    };

  const outputDirFs = path.normalize(options.outputDir);
  const outputDirImport = path.posix.normalize(options.outputDir);

  const serviceTypeFiles = glob.sync(options.serviceTypesPattern);

  const services: { name: string; path: string }[] = [];

  // init
  serviceTypeFiles.forEach(file => {
    const serviceRelativePath = getRelativePathForImport(
      options.outputDir,
      file,
    );

    const service = require(file);
    const name = service.name;

    services.push({
      name,
      path: serviceRelativePath,
    });
  });

  // service types file content
  const serviceTypesFileContent = Mustache.render(serviceTemplate, {
    services: services.map(({ path, name }) => ({
      path,
      name: getServiceTypeName(name),
    })),
  });

  formatAndSave(
    serviceTypesFileContent,
    path.join(options.outputDir, 'services.types.ts'),
  );

  const { meta, rawMetaNames: metaNames } = await rawMetaNames(
    services,
    outputDirImport,
  );

  const callObj: {
    [K: string]: { name: string; type: string; index: number };
  } = {};
  const emitObj: {
    [K: string]: { name: string; type: string; index: number };
  } = {};

  // call
  services.forEach(svc => {
    const { actionsLength } = meta[getServiceTypeName(svc.name)];
    const { eventsLength } = meta[getServiceTypeName(svc.name)];

    // actions GetCallParams/GetCallReturn
    for (let index: number = 0; index < actionsLength; index++) {
      const name = `${svc.name}.${
        metaNames[`Services${getServiceTypeName(svc.name)}ActionsName${index}`]
      }`;

      callObj[name] = {
        name,
        index,
        type: getServiceTypeName(svc.name),
      };
    }

    // events GetEmitParams
    for (let index: number = 0; index < eventsLength; index++) {
      const name = `${svc.name}.${
        metaNames[`Services${getServiceTypeName(svc.name)}EventsName${index}`]
      }`;

      emitObj[name] = {
        name,
        index,
        type: getServiceTypeName(svc.name),
      };
    }
  });

  const brokerTypesFileContent = Mustache.render(brokerTemplate, {
    callObj: Object.values(callObj),
    emitObj: Object.values(emitObj),
    ServiceNames: services
      .filter(({ name }) => !isServiceName(name))
      .map(({ name }) => `'${name}'`)
      .join('|'),
    ServiceActionNames: Object.keys(callObj)
      .map(name => `'${name}'`)
      .join('|'),
    // @TODO can events have overloads ? i think yes !
    ServiceEventNames: Object.keys(emitObj)
      .map(name => `'${name}'`)
      .join('|'),
  });

  console.log(brokerTypesFileContent);

  formatAndSave(
    brokerTypesFileContent,
    path.join(outputDirFs, 'broker.types.ts'),
  );
}

export async function generateBrokerWatch(options: GenerateBrokerOptions) {
  await generateBroker(options);
  return watch(options.serviceTypesPattern, async function(done) {
    await generateBroker(options);
    done();
  });
}
