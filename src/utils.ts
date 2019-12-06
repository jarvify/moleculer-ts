import prettier from 'prettier';
import fs from 'fs';
import watch from 'glob-watcher';
import glob from 'glob';
import path from 'path';
import cp from 'child_process';

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
  return path.posix
    .relative(path.posix.normalize(from), path.posix.normalize(to))
    .replace(/\.ts$/, '');
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
  const importMoleculerTs = `import * as MoleculerTs from 'moleculer-ts'`;
  serviceTypesFileContent += `${importMoleculerTs}\n`;

  services.forEach(svc => {
    serviceTypesFileContent += `declare module '${svc.path}' {
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

  type StrictObject<P, A> = A & { [K in Exclude<keyof P, keyof A>]: never };

  type PickByParam<P, A> = {
    [K in keyof P]: K extends keyof A ? A[K] : never;
  };

  export interface ServiceBroker {
    call<
    T extends ServiceActionNames,
    P extends GetCallParams<P>[T]
    >(
      actionName: T,
      params: P,
      opts?: Broker.CallingOptions,
    ): PromiseLike<GetCallReturn<P>[T]>;

    emit<T extends ServiceEventNames, P extends GetEmitParams<P>[T]>(
      eventName: T,
      payload: P,
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
  type GetCallParams<P> = { `;
  Object.keys(callObj).map(name => {
    brokerTypesServiceActionNames += ` | '${name}'`;

    const overloadUnionStrict = `MoleculerTs.Union.Strict<${callObj[
      name
    ].overloads
      .map(one => one.in)
      .join(' | ')}
      >`;

    brokerTypesFileContent += `'${name}': `;

    callObj[name].overloads.map(one => {
      brokerTypesFileContent += ` ${one.in} extends P ? ${one.in} : `;
    });

    brokerTypesFileContent += `StrictObject<
      P,
      ${overloadUnionStrict}
    >; `;
  });
  brokerTypesFileContent += '}';
  brokerTypesServiceActionNames += ',never>';

  brokerTypesFileContent += `
  type GetCallReturn<P> = { `;
  Object.keys(callObj).map(name => {
    brokerTypesFileContent += `'${name}': `;

    callObj[name].overloads.map(one => {
      brokerTypesFileContent += ` P extends PickByParam<P,${one.in}> ? ${one.out} : `;
    });

    brokerTypesFileContent += ' never; ';
  });
  brokerTypesFileContent += '}';

  let brokerTypesServiceEventsNames =
    'export type ServiceEventNames = Exclude<never';
  brokerTypesFileContent += `
  type GetEmitParams<P> = { `;
  Object.keys(emitObj).map(name => {
    brokerTypesServiceEventsNames += ` | '${name}'`;

    const overloadUnionStrict = `MoleculerTs.Union.Strict<${emitObj[
      name
    ].overloads
      .map(one => one.in)
      .join(' | ')}
      >`;

    brokerTypesFileContent += `'${name}': `;

    emitObj[name].overloads.map(one => {
      brokerTypesFileContent += ` ${one.in} extends P ? ${one.in} : `;
    });

    brokerTypesFileContent += `StrictObject<
        P,
        ${overloadUnionStrict}
      >; `;
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
