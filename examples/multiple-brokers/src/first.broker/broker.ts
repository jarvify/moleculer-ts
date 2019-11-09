import * as Broker from './moleculer';
import Validator from 'fastest-validator';
import actionsSchema from './types/actions.schema';

const serviceActionsSchema = actionsSchema as { [key: string]: any };
const validator = new Validator();

const validationMiddleware = {
  serviceCreated(service: any) {
    const serviceSpec = service._serviceSpecification;
    const serviceName = `${
      serviceSpec.version ? `${serviceSpec.version}.` : ''
    }${serviceSpec.name}`;

    if (serviceActionsSchema[serviceName]) {
      const serviceParams = serviceActionsSchema[serviceName];
      Object.keys(serviceParams).map((serviceActionName: string) => {
        const serviceActionSpec =
          serviceSpec.actions[`${serviceName}.${serviceActionName}`];
        if (serviceActionSpec) {
          // only assign if params not set, and generated params exits!
          if (!serviceActionSpec.params && serviceParams[serviceActionName]) {
            try {
              validator.compile(serviceParams[serviceActionName]);
              serviceActionSpec.params = serviceParams[serviceActionName];
            } catch (err) {
              service.logger.warn(
                `Cannot compile params validator for ${serviceName}.${serviceActionName}, plese define action params manually.`,
              );
            }
          }
        }
      });
    }
  },
};

export const name = 'first.broker';
let broker: Broker.ServiceBroker;

export async function start() {
  try {
    const broker = await createBroker();
    loadServices(broker);
    await broker.start();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

export async function getConfig(): Promise<Broker.BrokerOptions> {
  return {
    logLevel: 'info',
    middlewares: [validationMiddleware],
  };
}

export function getBroker() {
  if (!broker) {
    throw new Error(`Broker ${name} not created!`);
  }
  return broker;
}

export async function createBroker(config?: Broker.BrokerOptions) {
  if (broker) {
    throw new Error(`Broker ${name} already created!`);
  }

  broker = await createBrokerInstance(config);
  return broker;
}

export async function createBrokerInstance(config?: Broker.BrokerOptions) {
  if (!config) {
    config = await getConfig();
  }

  return new Broker.ServiceBroker(config);
}

export function loadServices(broker: Broker.ServiceBroker) {
  broker.loadServices(`${__dirname}`, '**/*.service.{ts,js}');
}
