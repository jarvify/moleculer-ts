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

type Services = {
  name: string;
  path: string;
  tuples: ReturnType<typeof parseTsConcatMultiple>;
}[];

function getServiceActionTupleName(sIndex: number, aIndex: number) {
  return `Service${sIndex}Action${aIndex}`;
}

function getServiceEventTupleName(sIndex: number, aIndex: number) {
  return `Service${sIndex}Event${aIndex}`;
}

function getImportForTuples(services: Services, rootDir?: string): string {
  let tuplesImport = '';

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

      tuplesImport += `import { ${action.name} as ${getServiceActionTupleName(
        sIndex,
        aIndex,
      )} } from '${fromModule}';\n`;
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

      tuplesImport += `import { ${event.name} as ${getServiceEventTupleName(
        sIndex,
        aIndex,
      )} } from '${fromModule}';\n`;
    });
  });

  return tuplesImport;
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

async function rawServiceMeta(services: Services, outputDirImport: string) {
  const importMoleculerTs = `import * as MoleculerTs from 'moleculer-ts'`;

  let cpServiceMetaFile = ``;
  cpServiceMetaFile += `
     import { enumerate } from 'ts-transformer-enumerate';
     ${importMoleculerTs};
     ${getImportForTuples(services, outputDirImport)}
   `;

  cpServiceMetaFile += 'const meta: any = {';

  services.forEach((service, sIndex) => {
    service.tuples.actions.map((action, aIndex) => {
      cpServiceMetaFile += `'${getServiceActionTupleName(
        sIndex,
        aIndex,
      )}': Object.keys(enumerate<MoleculerTs.GetAllNameKeysAndLength<${getServiceActionTupleName(
        sIndex,
        aIndex,
      )}>>()).length -1,`;
    });
    service.tuples.events.map((event, aIndex) => {
      cpServiceMetaFile += `'${getServiceEventTupleName(
        sIndex,
        aIndex,
      )}': Object.keys(enumerate<MoleculerTs.GetAllNameKeysAndLength<${getServiceEventTupleName(
        sIndex,
        aIndex,
      )}>>()).length -1,`;
    });
  });

  cpServiceMetaFile += '}\n';

  cpServiceMetaFile += 'console.log(JSON.stringify(meta));';
  const cpServiceMeta = cp.spawn(
    `${path.join('node_modules', '.bin', 'ts-node')}`,
    ['-e', cpServiceMetaFile],
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

  const services: Services = [];

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
