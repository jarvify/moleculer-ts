import prettier from 'prettier';
import fs from 'fs';
import watch from 'glob-watcher';
import glob from 'glob';
import path from 'path';
import cp from 'child_process';

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
  return `./${path.posix
    .relative(path.posix.normalize(from), path.posix.normalize(to))
    .replace(/\.ts$/, '')}`;
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

export async function generateBroker(options: GenerateBrokerOptions) {
  const isServiceName =
    options.isServiceName ||
    function(name: string) {
      return !Boolean(name.match(/^\$/));
    };

  const outputDirFs = path.normalize(options.outputDir);
  const outputDirImport = path.posix.normalize(options.outputDir);

  const serviceTypeFiles = glob.sync(options.serviceTypesPattern);

  let serviceTypesFileContent = '';
  const services: Services = [];

  // init
  serviceTypeFiles.forEach(file => {
    const serviceRelativePath = getRelativePathForImport(
      options.outputDir,
      file,
    );

    const serviceContent = fs.readFileSync(file).toString();

    const tuples = parseTsConcatMultiple(serviceContent);

    // get service name from variable!
    const service = require(file);
    const name = service.name;

    services.push({
      name,
      path: serviceRelativePath,
      tuples,
    });
  });

  // service type file gen
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

  const serviceMeta = JSON.parse(rawServiceMeta);

  serviceTypesFileContent += `${importMoleculerTs}
  ${getImportForTuples(services)}
  `;

  services.forEach((svc, sIndex) => {
    const svcActions: string[] = [];
    const svcEvents: string[] = [];
    svc.tuples.actions.map((_, aIndex) => {
      for (
        let i = 0;
        i < serviceMeta[getServiceActionTupleName(sIndex, aIndex)];
        i++
      ) {
        svcActions.push(`${getServiceActionTupleName(sIndex, aIndex)}[${i}]`);
      }
    });
    svc.tuples.actions.map((_, aIndex) => {
      for (
        let i = 0;
        i < serviceMeta[getServiceEventTupleName(sIndex, aIndex)];
        i++
      ) {
        svcEvents.push(`${getServiceEventTupleName(sIndex, aIndex)}[${i}]`);
      }
    });

    serviceTypesFileContent += `declare module '${svc.path}' {
        
        type Actions = [${svcActions.join(',')}]
        type Events = [${svcEvents.join(',')}] 
        
        type ActionParams<T extends MoleculerTs.GetNames<${getServiceTypeName(
          svc.name,
        )}.Actions>> = MoleculerTs.GetParamsStrict<
        ${getServiceTypeName(svc.name)}.Actions,
          T
        >;
        type ActionReturn<T extends MoleculerTs.GetNames<${getServiceTypeName(
          svc.name,
        )}.Actions>> = MoleculerTs.GetReturn<Actions, T>;
        type EventParams<T extends MoleculerTs.GetNames<${getServiceTypeName(
          svc.name,
        )}.Events>> = MoleculerTs.GetParamsStrict<${getServiceTypeName(
      svc.name,
    )}.Events, T>;
        type ServiceOwnActions = MoleculerTs.GetServiceOwnActions<${getServiceTypeName(
          svc.name,
        )}.OwnActions>;
      }`;
  });

  services.forEach(svc => {
    serviceTypesFileContent += `import * as ${getServiceTypeName(
      svc.name,
    )} from '${svc.path}';\n`;
  });

  serviceTypesFileContent += '\nexport {';

  services.forEach(svc => {
    serviceTypesFileContent += `${getServiceTypeName(svc.name)},`;
  });

  serviceTypesFileContent += '}';

  formatAndSave(
    serviceTypesFileContent,
    path.join(options.outputDir, 'services.types.ts'),
  );

  // broker type file gen
  let cpMetaFile = ``;
  cpMetaFile += `
    import * as Services from '${outputDirImport}/services.types';
    import { enumerate } from 'ts-transformer-enumerate';
    ${importMoleculerTs}\n;
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
    ${importMoleculerTs}\n;
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

  const metaNames = JSON.parse(rawMetaNames);

  // broker type file
  let brokerTypesFileContent = '';

  brokerTypesFileContent += `import * as MoleculerTs from 'moleculer-ts';
  import * as Broker from './moleculer';
  import * as Services from './services.types';

  export interface ServiceBroker {
    call<
    T extends ServiceActionNames,
    >(
      actionName: T,
      params: GetCallParams[T],
      opts?: Broker.CallingOptions,
    ): PromiseLike<GetCallReturn[T]>;

    emit<T extends ServiceEventNames>(
      eventName: T,
      payload: GetEmitParams[T],
      groups?: ServiceNamesEmitGroup,
    ): void;

    broadcast: ServiceBroker['emit']
    broadcastLocal: ServiceBroker['emit']
  }
  `;

  const callObj: {
    [K: string]: { overloads: { in: string; out: string }[] };
  } = {};
  const emitObj: {
    [K: string]: { overloads: { in: string }[] };
  } = {};

  // call
  services.forEach(svc => {
    Array(meta[getServiceTypeName(svc.name)].actionsLength)
      .fill(0)
      .forEach((_, index) => {
        const name = `${svc.name}.${
          metaNames[
            `Services${getServiceTypeName(svc.name)}ActionsName${index}`
          ]
        }`;

        if (!callObj[name]) {
          callObj[name] = {
            overloads: [],
          };
        }

        callObj[name].overloads.push({
          in: `Services.${getServiceTypeName(
            svc.name,
          )}.Actions[${index}]['in']`,
          out: `Services.${getServiceTypeName(
            svc.name,
          )}.Actions[${index}]['out']`,
        });
      });
  });

  services.forEach(svc => {
    Array(meta[getServiceTypeName(svc.name)].eventsLength)
      .fill(0)
      .forEach((_, index) => {
        const name = `${svc.name}.${
          metaNames[`Services${getServiceTypeName(svc.name)}EventsName${index}`]
        }`;

        if (!emitObj[name]) {
          emitObj[name] = {
            overloads: [],
          };
        }

        emitObj[name].overloads.push({
          in: `Services.${getServiceTypeName(svc.name)}.Events[${index}]['in']`,
        });
      });
  });

  let brokerTypesServiceActionNames =
    'export type ServiceActionNames = Exclude<never';

  brokerTypesFileContent += `
  type GetCallParams = { `;
  Object.keys(callObj).map(name => {
    brokerTypesServiceActionNames += ` | '${name}'`;

    brokerTypesFileContent += `'${name}': `;

    if (callObj[name].overloads.length > 1) {
      throw new Error(
        `${name} has multiple overloads, please make sure u have only one declaration.`,
      );
    }

    callObj[name].overloads.map(one => {
      brokerTypesFileContent += `${one.in}; `;
    });
  });
  brokerTypesFileContent += '}';
  brokerTypesServiceActionNames += ',never>';

  brokerTypesFileContent += `
  type GetCallReturn = { `;
  Object.keys(callObj).map(name => {
    brokerTypesFileContent += `'${name}': `;

    if (callObj[name].overloads.length > 1) {
      throw new Error(
        `${name} has multiple overloads, please make sure u have only one declaration.`,
      );
    }

    callObj[name].overloads.map(one => {
      brokerTypesFileContent += `${one.out}; `;
    });
  });
  brokerTypesFileContent += '}';

  // @TODO can events have overloads ? i think yes !
  let brokerTypesServiceEventsNames =
    'export type ServiceEventNames = Exclude<never';
  brokerTypesFileContent += `
  type GetEmitParams= { `;
  Object.keys(emitObj).map(name => {
    brokerTypesServiceEventsNames += ` | '${name}'`;

    const overloadUnionStrict = `MoleculerTs.Union.Strict<${emitObj[
      name
    ].overloads
      .map(one => one.in)
      .join(' | ')}
      >;`;

    brokerTypesFileContent += `'${name}': ${overloadUnionStrict} `;
  });
  brokerTypesFileContent += '}';
  brokerTypesServiceEventsNames += ',never>';

  brokerTypesFileContent += `
  export type ServiceNames = Exclude<never `;
  services.forEach((svc, index) => {
    if (!isServiceName(svc.name)) {
      return;
    }
    brokerTypesFileContent += `| '${svc.name}' `;
  });
  brokerTypesFileContent += ',never>;\n';
  brokerTypesFileContent += `export type ServiceNamesEmitGroup = ServiceNames | ServiceNames[];
    ${brokerTypesServiceEventsNames};
    ${brokerTypesServiceActionNames}
    `;

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
