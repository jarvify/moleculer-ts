import prettier from 'prettier';
import fs from 'fs';
import watch from 'glob-watcher';
import glob from 'glob';
import path from 'path';
import cp from 'child_process';
import Mustache from 'mustache';

import { parseTsConcatMultiple } from './parse-ts';

type GenerateBrokerOptions = {
  serviceTypesPattern: string;
  outputDir: string;
  isServiceName?: (name: string) => boolean;
};

type Service = {
  name: string;
  path: string;
  tuples: ReturnType<typeof parseTsConcatMultiple>;
};

type TupleImport = {
  name: string;
  alias: string;
  module: string;
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
const serviceMetaTemplate = fs.readFileSync(
  path.join(__dirname, 'templates/meta', 'service.ts.mustache'),
  'utf-8',
);
const rawMetaTemplate = fs.readFileSync(
  path.join(__dirname, 'templates/meta', 'raw.ts.mustache'),
  'utf-8',
);
const namesMetaTemplate = fs.readFileSync(
  path.join(__dirname, 'templates/meta', 'names.ts.mustache'),
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

function getServiceActionTupleName(sIndex: number, aIndex: number) {
  return `Service${sIndex}Action${aIndex}`;
}

function getServiceEventTupleName(sIndex: number, aIndex: number) {
  return `Service${sIndex}Event${aIndex}`;
}

function getImportForTuples(
  services: Service[],
  rootDir?: string,
): TupleImport[] {
  const tuplesImports: TupleImport[] = [];

  services.map((service, sIndex) => {
    service.tuples.actions.map((action, aIndex) => {
      let fromModule = action.fromModule;
      if (fromModule && fromModule.length > 0 && fromModule.startsWith('.')) {
        fromModule = `${rootDir ? `${rootDir}/` : ''}${path.posix.dirname(
          service.path,
        )}/${fromModule}`;
      }
      if (fromModule === null) {
        fromModule = `${rootDir ? `${rootDir}/` : ''}${service.path}`;
      }

      tuplesImports.push({
        name: action.name,
        alias: getServiceActionTupleName(sIndex, aIndex),
        module: fromModule,
      });
    });

    service.tuples.events.map((event, aIndex) => {
      let fromModule = event.fromModule;
      if (fromModule && fromModule.length > 0 && fromModule.startsWith('.')) {
        fromModule = `${rootDir ? `${rootDir}/` : ''}${path.posix.dirname(
          service.path,
        )}/${fromModule}`;
      }
      if (fromModule === null) {
        fromModule = `${rootDir ? `${rootDir}/` : ''}${service.path}`;
      }

      tuplesImports.push({
        name: event.name,
        alias: getServiceEventTupleName(sIndex, aIndex),
        module: fromModule,
      });
    });
  });

  return tuplesImports;
}

async function rawMetaNames(services: Service[], outputDirImport: string) {
  // service types meta file content
  const metaFileContent = Mustache.render(rawMetaTemplate, {
    serviceNames: services.map(({ name }) => getServiceTypeName(name)),
    outputDirImport,
  });

  const cpMeta = cp.spawn(`${path.join('node_modules', '.bin', 'ts-node')}`, [
    '-e',
    metaFileContent,
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
  const names: any[] = [];

  services.forEach(svc => {
    const { actionsLength, eventsLength } = meta[getServiceTypeName(svc.name)];

    names.push({
      name: getServiceTypeName(svc.name),
      actions: Array.from(Array(actionsLength).keys()),
      events: Array.from(Array(eventsLength).keys()),
    });
  });

  const metaNamesFileContent = Mustache.render(namesMetaTemplate, {
    outputDirImport,
    names,
  });

  const cpMetaNames = cp.spawn(
    `${path.join('node_modules', '.bin', 'ts-node')}`,
    ['-e', metaNamesFileContent],
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

async function rawServiceMeta(services: Service[], outputDirImport: string) {
  const metaItems: string[] = [];

  services.forEach((service, sIndex) => {
    service.tuples.actions.map((action, aIndex) => {
      metaItems.push(getServiceActionTupleName(sIndex, aIndex));
    });

    service.tuples.events.map((event, aIndex) => {
      metaItems.push(getServiceEventTupleName(sIndex, aIndex));
    });
  });

  // service types meta file content
  const serviceMetaFileContent = Mustache.render(serviceMetaTemplate, {
    importForTuples: getImportForTuples(services, outputDirImport),
    metaItems,
  });

  const cpServiceMeta = cp.spawn(
    `${path.join('node_modules', '.bin', 'ts-node')}`,
    ['-e', serviceMetaFileContent],
  );

  let rawServiceMeta = '';

  cpServiceMeta.stdout.on('data', data => {
    rawServiceMeta += data;
  });

  cpServiceMeta.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
  });

  await new Promise(resolve => {
    cpServiceMeta.on('close', code => {
      resolve();
    });
  });

  return {
    rawServiceMeta: JSON.parse(rawServiceMeta),
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

  const services: Service[] = [];

  // init
  serviceTypeFiles.forEach(file => {
    const serviceRelativePath = getRelativePathForImport(
      options.outputDir,
      file,
    );

    const serviceContent = fs.readFileSync(file).toString();
    const tuples = parseTsConcatMultiple(serviceContent);

    const service = require(file);
    const name = service.name;

    services.push({
      name,
      path: serviceRelativePath,
      tuples,
    });
  });

  // get service meta tuples

  const { rawServiceMeta: serviceMeta } = await rawServiceMeta(
    services,
    outputDirImport,
  );

  // service types file content
  const serviceTypesFileContent = Mustache.render(serviceTemplate, {
    importForTuples: getImportForTuples(services),
    services: services.map(({ path, name, tuples }, sIndex) => {
      const actions: string[] = [];
      const events: string[] = [];
      tuples.actions.map((_, aIndex) => {
        for (
          let i = 0;
          i < serviceMeta[getServiceActionTupleName(sIndex, aIndex)];
          i++
        ) {
          actions.push(`${getServiceActionTupleName(sIndex, aIndex)}[${i}]`);
        }
      });
      tuples.actions.map((_, aIndex) => {
        for (
          let i = 0;
          i < serviceMeta[getServiceEventTupleName(sIndex, aIndex)];
          i++
        ) {
          events.push(`${getServiceEventTupleName(sIndex, aIndex)}[${i}]`);
        }
      });

      return {
        path,
        name: getServiceTypeName(name),
        actions: actions.join(','),
        events: events.join(','),
      };
    }),
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
    const { actionsLength, eventsLength } = meta[getServiceTypeName(svc.name)];

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
      .filter(({ name }) => isServiceName(name))
      .map(({ name }) => name),
    ServiceActionNames: Object.keys(callObj),
    ServiceEventNames: Object.keys(emitObj),
  });

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
