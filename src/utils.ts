import prettier from 'prettier';
import fs from 'fs';
import watch from 'glob-watcher';
import glob from 'glob';
import path from 'path';
import cp from 'child_process';

const capitalize = (s: string) => {
  if (typeof s !== 'string') {
    return '';
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export async function formatAndSave(input: string, destination: string) {
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

type GenerateBrokerOptions = {
  serviceTypesPattern: string;
  outputTypesDir: string;
  rootDir?: string;
};

export function getServiceTypeName(name: string) {
  return `${capitalize(name)}ServiceTypes`;
}

export async function generateBroker(options: GenerateBrokerOptions) {
  if (!options.rootDir) {
    options.rootDir = process.cwd();
  }

  const serviceTypeFiles = glob.sync(options.serviceTypesPattern);

  let serviceTypesFileContent = '';

  let services: { name: string; path: string }[] = [];

  // init
  serviceTypeFiles.forEach(file => {
    const data = fs.readFileSync(file).toString();
    const res = data.match(/export const name: .*/);

    if (res) {
      const name = res[0]
        .replace('export const name: ', '')
        .replace(/=.*/, '')
        .replace(/[\'\"]/g, '')
        .trim();

      services.push({
        name,
        path: `${options.rootDir}/${file.replace(/\.ts$/, '')}`,
      });
    } else {
      throw new Error(`"export const name: /"  Not found in ${file}`);
    }
  });

  // service types file content
  const importMoleculerTs = `import * as MoleculerTs from 'src/index'`;
  serviceTypesFileContent += `${importMoleculerTs}\n`;

  services.forEach(svc => {
    serviceTypesFileContent += `declare module '${svc.path}' {
        type ActionParams<T extends MoleculerTs.GetNames<${getServiceTypeName(
          svc.name,
        )}.Actions>> = MoleculerTs.GetParams<
        ${getServiceTypeName(svc.name)}.Actions,
          T
        >;
        type ActionReturn<T extends MoleculerTs.GetNames<${getServiceTypeName(
          svc.name,
        )}.Actions>> = MoleculerTs.GetReturn<Actions, T>;
        type EventReturn<T extends MoleculerTs.GetNames<${getServiceTypeName(
          svc.name,
        )}.Events>> = MoleculerTs.GetParams<${getServiceTypeName(
      svc.name,
    )}.Events, T>;
        type ServiceInterface = MoleculerTs.GetServiceInterface<${getServiceTypeName(
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
    `${options.outputTypesDir}/services.types.ts`,
  );

  // broker type file gen
  let cpMetaFile = ``;
  cpMetaFile += `
    import * as Services from '${options.outputTypesDir}/services.types';
    import * as MoleculerTs from './src/index'\n;
  `;

  cpMetaFile += 'const meta: any = {';
  services.forEach(svc => {
    cpMetaFile += `'${getServiceTypeName(
      svc.name,
    )}': { actionsLength: Object.keys(MoleculerTs.enumerate<MoleculerTs.GetNameKeys<Services.${getServiceTypeName(
      svc.name,
    )}.Actions, any>>()).length, eventsLength: Object.keys(MoleculerTs.enumerate<MoleculerTs.GetNameKeys<Services.${getServiceTypeName(
      svc.name,
    )}.Events, any>>()).length },`;
  });

  cpMetaFile += '}\n';

  cpMetaFile += 'console.log(JSON.stringify(meta));';

  const cpMeta = cp.spawn(`./node_modules/.bin/ts-node`, ['-e', cpMetaFile]);

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
    import * as Services from '${options.outputTypesDir}/services.types';
    import * as MoleculerTs from './src/index'\n;
  `;

  cpMetaNamesFile += 'const meta: any = {';
  services.forEach(svc => {
    Array(meta[getServiceTypeName(svc.name)].actionsLength)
      .fill(0)
      .forEach((_, index) => {
        cpMetaNamesFile += `Services${getServiceTypeName(
          svc.name,
        )}ActionsName${index}: Object.keys(MoleculerTs.enumerate<Services.${getServiceTypeName(
          svc.name,
        )}.Actions[${index}]['name']>())[0],`;
      });

    Array(meta[getServiceTypeName(svc.name)].eventsLength)
      .fill(0)
      .forEach((_, index) => {
        cpMetaNamesFile += `Services${getServiceTypeName(
          svc.name,
        )}EventsName${index}: Object.keys(MoleculerTs.enumerate<Services.${getServiceTypeName(
          svc.name,
        )}.Events[${index}]['name']>())[0],`;
      });
  });

  cpMetaNamesFile += '}\n';

  cpMetaNamesFile += 'console.log(JSON.stringify(meta));';

  const cpMetaNames = cp.spawn(`./node_modules/.bin/ts-node`, [
    '-e',
    cpMetaNamesFile,
  ]);

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

  brokerTypesFileContent += ` import {
    Service as MoleculerService,
    Context as MoleculerContext,
    ServiceBroker as MoleculerServiceBroker,
    CallingOptions,
  } from 'moleculer';

  import * as Services from './services.types';
  export interface Broker {\n`;

  // call
  services.forEach(svc => {
    Array(meta[getServiceTypeName(svc.name)].actionsLength)
      .fill(0)
      .forEach((_, index) => {
        brokerTypesFileContent += `
        call(
          actionName: '${svc.name}.${
          metaNames[
            `Services${getServiceTypeName(svc.name)}ActionsName${index}`
          ]
        }',
          params: Services.${getServiceTypeName(
            svc.name,
          )}.Actions[${index}]['in'],
          opts?: CallingOptions,
        ): PromiseLike<Services.${getServiceTypeName(
          svc.name,
        )}.Actions[${index}]['out']>;
        `;
      });
  });

  // emit
  services.forEach(svc => {
    Array(meta[getServiceTypeName(svc.name)].eventsLength)
      .fill(0)
      .forEach((_, index) => {
        brokerTypesFileContent += `
        emit(
          eventName: '${svc.name}.${
          metaNames[`Services${getServiceTypeName(svc.name)}EventsName${index}`]
        }',
          payload: Services.${getServiceTypeName(
            svc.name,
          )}.Events[${index}]['in'],
          groups?: ServiceNamesGroup
        ): void
        `;
      });
  });
  brokerTypesFileContent += `
  broadcast: Broker['emit']
  broadcastLocal: Broker['emit']
  `;

  brokerTypesFileContent += '}';

  brokerTypesFileContent += 'export type ServiceNames = ';
  services.forEach((svc, index) => {
    brokerTypesFileContent += `'${svc.name}'`;
    if (services.length - 1 > index) {
      brokerTypesFileContent += ' | ';
    } else {
      brokerTypesFileContent += '\n';
    }
  });
  brokerTypesFileContent +=
    'export type ServiceNamesGroup = ServiceNames | ServiceNames[];';

  formatAndSave(
    brokerTypesFileContent,
    `${options.outputTypesDir}/broker.types.ts`,
  );

  let schemaFileContent = '';
}

export async function generateBrokerWatch(options: GenerateBrokerOptions) {
  await generateBroker(options);
  watch(options.serviceTypesPattern, async function(done) {
    await generateBroker(options);
    done();
  });
}
