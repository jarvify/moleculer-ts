import { Service, Action, Event, Method } from 'moleculer-decorators';
import * as Broker from '@second.broker/moleculer';
import {
  TestServiceTypes,
  BrokerServiceTypes,
  NodeServiceTypes,
} from '@second.broker/types';

interface TestService {
  name: typeof TestServiceTypes.name;
}
@Service({
  name: TestServiceTypes.name,
  mixins: [],
})
class TestService extends Broker.Service
  implements TestServiceTypes.ServiceInterface {
  settings: any;

  @Event({
    name: Broker.eventName('$broker.started'),
  })
  brokerStarted(payload: BrokerServiceTypes.EventParams<'started'>) {
    console.log('brokerStarted');
  }

  @Event({
    name: Broker.eventName('$node.connected'),
  })
  nodeConnected(payload: NodeServiceTypes.EventParams<'connected'>) {
    console.log('nodeConnected');
  }

  created() {
    console.log(`created - ${this.name}`);
  }
}

export = TestService;
