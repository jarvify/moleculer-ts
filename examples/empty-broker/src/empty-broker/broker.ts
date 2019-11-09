import * as Broker from './moleculer';

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
