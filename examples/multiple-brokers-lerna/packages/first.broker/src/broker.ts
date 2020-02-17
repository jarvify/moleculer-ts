import { ServiceBroker, BrokerOptions } from './moleculer';
export { ServiceBroker } from './moleculer';

export const name = 'first.broker';
let broker: ServiceBroker;

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

export async function getConfig(): Promise<BrokerOptions> {
  return {
    logLevel: 'info',
  };
}

export function getBroker() {
  if (!broker) {
    throw new Error(`Broker ${name} not created!`);
  }
  return broker;
}

export async function createBroker(config?: BrokerOptions) {
  if (broker) {
    throw new Error(`Broker ${name} already created!`);
  }

  broker = await createBrokerInstance(config);
  return broker;
}

export async function createBrokerInstance(config?: BrokerOptions) {
  if (!config) {
    config = await getConfig();
  }

  return new ServiceBroker(config);
}

export function loadServices(broker: ServiceBroker) {
  broker.loadServices(`${__dirname}`, '**/*.service.{ts,js}');
}
