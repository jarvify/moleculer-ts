import prettier from 'prettier';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import cp from 'child_process';
import Mustache from 'mustache';

export type GenerateBrokerOptions = {
  serviceTypesPattern: string;
  outputDir: string;
  generateActionsParamsAssert?: boolean;
  generateEventsParamsAssert?: boolean;
  isServiceName?: (name: string) => boolean;
};

type Service = {
  name: string;
  path: string;
};

const capitalize = (s: string) => {
  if (typeof s !== 'string') {
    return '';
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const servicesTemplate = fs.readFileSync(
  path.join(__dirname, 'templates', 'services.ts.mustache'),
  'utf-8',
);

const brokerTemplate = fs.readFileSync(
  path.join(__dirname, 'templates', 'broker.ts.mustache'),
  'utf-8',
);

const actionsParamsAssertTemplate = fs.readFileSync(
  path.join(__dirname, 'templates', 'actions.params.assert.ts.mustache'),
  'utf-8',
);

const eventsParamsAssertTemplate = fs.readFileSync(
  path.join(__dirname, 'templates', 'events.params.assert.ts.mustache'),
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
  const pureName = name
    .replace(
      /[^a-zA-Z0-9][a-zA-Z0-9]/g,
      one => one.charAt(0) + one.charAt(1).toUpperCase(),
    )
    .replace(/[^a-zA-Z0-9]/g, '');
  return `${capitalize(pureName)}ServiceTypes`;
}

function getRelativePathForImport(from: string, to: string) {
  return path.posix
    .relative(path.posix.normalize(from), path.posix.normalize(to))
    .replace(/\.ts$/, '');
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

    const service = require(file);
    const name = service.name;

    services.push({
      name,
      path: serviceRelativePath,
    });
  });

  // service types file content
  const serviceTypesFileContent = Mustache.render(servicesTemplate, {
    services: services.map(({ path, name }) => {
      return {
        path,
        name: getServiceTypeName(name),
      };
    }),
  });

  await formatAndSave(
    serviceTypesFileContent,
    path.join(options.outputDir, 'services.types.ts'),
  );

  const { meta, rawMetaNames: metaNames } = await rawMetaNames(
    services,
    outputDirImport,
  );

  const callObj: {
    [K: string]: {
      actionName: string;
      name: string;
      type: string;
      index: number;
    };
  } = {};
  const emitObj: {
    [K: string]: {
      eventName: string;
      name: string;
      type: string;
      index: number;
    };
  } = {};

  // call
  services.forEach(svc => {
    const { actionsLength, eventsLength } = meta[getServiceTypeName(svc.name)];

    // actions GetCallParams/GetCallReturn
    for (let index: number = 0; index < actionsLength; index++) {
      const actionName = `${
        metaNames[`Services${getServiceTypeName(svc.name)}ActionsName${index}`]
      }`;
      const name = `${svc.name}.${actionName}`;

      if (callObj[name] !== undefined) {
        throw new Error(`Action ${name} multiple type definition detected.`);
      }

      callObj[name] = {
        actionName,
        name,
        index,
        type: getServiceTypeName(svc.name),
      };
    }

    // events GetEmitParams
    for (let index: number = 0; index < eventsLength; index++) {
      const eventName = `${
        metaNames[`Services${getServiceTypeName(svc.name)}EventsName${index}`]
      }`;
      const name = `${svc.name}.${eventName}`;

      if (emitObj[name] !== undefined) {
        throw new Error(`Event ${name} multiple type definition detected.`);
      }

      emitObj[name] = {
        eventName,
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

  await formatAndSave(
    brokerTypesFileContent,
    path.join(outputDirFs, 'broker.types.ts'),
  );

  if (options.generateActionsParamsAssert) {
    const servicesParamsAssertFileContent = Mustache.render(
      actionsParamsAssertTemplate,
      {
        callObj: Object.values(callObj),
      },
    );

    await formatAndSave(
      servicesParamsAssertFileContent,
      path.join(outputDirFs, 'actions.params.assert.ts'),
    );
  }

  if (options.generateEventsParamsAssert) {
    const eventsParamsAssertFileContent = Mustache.render(
      eventsParamsAssertTemplate,
      {
        emitObj: Object.values(emitObj),
      },
    );

    await formatAndSave(
      eventsParamsAssertFileContent,
      path.join(outputDirFs, 'events.params.assert.ts'),
    );
  }
}
