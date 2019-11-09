import prettier from 'prettier';
import fs from 'fs';
import watch from 'glob-watcher';
import glob from 'glob';
import path from 'path';
import cp from 'child_process';

type GenerateBrokerOptions = {
  serviceTypesPattern: string;
  outputDir: string;
  generateActionsSchema?: boolean;
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
  if (typeof options.generateActionsSchema !== 'boolean') {
    options.generateActionsSchema = true;
  }

  let isServiceName =
    options.isServiceName ||
    function(name: string) {
      return !Boolean(name.match(/^\$/));
    };

  const outputDirFs = path.normalize(options.outputDir);
  const outputDirImport = path.posix.normalize(options.outputDir);

  const serviceTypeFiles = glob.sync(options.serviceTypesPattern);

  let serviceTypesFileContent = '';
  let services: { name: string; path: string }[] = [];

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
    path.join(options.outputDir, 'services.types.ts'),
  );

  type C = 'A' | {};

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

  brokerTypesFileContent += ` import * as Broker from './moleculer';
  import * as Services from './services.types';
  export interface ServiceBroker {
    call(actionName: never): never;
    emit(actionName: never): never;  
  `;

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
          opts?: Broker.CallingOptions,
        ): PromiseLike<Services.${getServiceTypeName(
          svc.name,
        )}.Actions[${index}]['out']>;
        `;
      });
  });

  let brokerTypesServiceEventsNames = 'export type ServiceEventNames = never';
  // emit
  services.forEach(svc => {
    Array(meta[getServiceTypeName(svc.name)].eventsLength)
      .fill(0)
      .forEach((_, index) => {
        brokerTypesServiceEventsNames += ` | '${svc.name}.${
          metaNames[`Services${getServiceTypeName(svc.name)}EventsName${index}`]
        }'`;

        brokerTypesFileContent += `
        emit(
          eventName: '${svc.name}.${
          metaNames[`Services${getServiceTypeName(svc.name)}EventsName${index}`]
        }',
          payload: Services.${getServiceTypeName(
            svc.name,
          )}.Events[${index}]['in'],
          groups?: ServiceNamesEmitGroup
        ): void
        `;
      });
  });
  brokerTypesFileContent += `
  broadcast: ServiceBroker['emit']
  broadcastLocal: ServiceBroker['emit']
  `;

  brokerTypesFileContent += '}';

  brokerTypesFileContent += `
  export type ServiceNames = never `;
  services.forEach((svc, index) => {
    if (!isServiceName(svc.name)) {
      return;
    }
    brokerTypesFileContent += `| '${svc.name}' `;
  });
  brokerTypesFileContent += ';\n';
  brokerTypesFileContent += `export type ServiceNamesEmitGroup = ServiceNames | ServiceNames[];
    ${brokerTypesServiceEventsNames};
    `;

  formatAndSave(
    brokerTypesFileContent,
    path.join(outputDirFs, 'broker.types.ts'),
  );

  // actions schema
  if (options.generateActionsSchema) {
    let cpSchemaFile = ``;
    cpSchemaFile += `
   import * as Services from '${outputDirImport}/services.types';
   import { schema } from 'ts-transformer-json-schema';
   import { enumerate } from 'ts-transformer-enumerate';
   ${importMoleculerTs}\n;
 `;

    cpSchemaFile += ``;

    cpSchemaFile += 'const meta: any = {';

    services.forEach(svc => {
      cpSchemaFile += `'${svc.name}': {`;
      if (meta[getServiceTypeName(svc.name)].actionsLength > 0) {
        Object.values(meta[getServiceTypeName(svc.name)].actionsEnum).forEach(
          actionName => {
            cpSchemaFile += `'${actionName}': schema<Services.${getServiceTypeName(
              svc.name,
            )}.ActionParams<'${actionName}'>>(),`;
          },
        );
      }
      cpSchemaFile += `},`;
    });

    cpSchemaFile += '}\n';

    cpSchemaFile += 'console.log(JSON.stringify(meta));';

    const cpSchema = cp.spawn(
      `${path.join('node_modules', '.bin', 'ts-node')}`,
      ['-e', cpSchemaFile],
    );

    let rawMetaSchema = '';

    cpSchema.stdout.on('data', data => {
      rawMetaSchema += data;
    });

    cpSchema.stderr.on('data', data => {
      console.error(`stderr: ${data}`);
    });

    await new Promise(resolve => {
      // @TODO investigate not flushing output
      cpSchema.on('exit', code => {
        resolve();
      });
    });

    let schemaFileContent = 'export default ';
    schemaFileContent += rawMetaSchema;

    await formatAndSave(
      schemaFileContent,
      path.join(outputDirFs, 'actions.schema.ts'),
    );
  }
}

export async function generateBrokerWatch(options: GenerateBrokerOptions) {
  await generateBroker(options);
  return watch(options.serviceTypesPattern, async function(done) {
    await generateBroker(options);
    done();
  });
}
