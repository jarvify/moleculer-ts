![Moleculer TypeScript](moleculer-ts.gif)

# moleculer-ts examples

Would you like to have a typescript autocomplete hints whenever you hit `broker.call()` function? 
With a simple customization of moleculer's types definition we can achieve this.

Unfortunately, there isn't a straightforward way how to redeclare moleculer's definitions to enable this, so we have to clone it and alter it
based on our needs. This means we need to rewrite moleculer's Service / Broker `call` and `emit` function types.

### Enhanced moleculer.d.ts

We are going to use your generated `broker.types.ts` definitions in [moleculer.d.ts](single-broker/src/types/moleculer.d.ts).

> We would be super excited, if you can help us to introduce a better way how to extend Moleculer's origin definitions
> without cloning and rewriting them at all. If you are an expert in TypeScript, we would love to get some help with this :)

The main idea is to replace `call`/`emit` and other functions for our typed functions from broker

```typescript
import {
  ServiceBroker as MyBroker,
  ServiceNames,
  ServiceEventNames,
} from './broker.types';

type MyBrokerCall = MyBroker['call'];
type MyBrokerEmit = MyBroker['emit'];

// moleculer.d

class Context<P = unknown, M = unknown> {
  ...
  call: MyBrokerCall;
  emit: MyBrokerEmit;
  ...
}

class ServiceBroker {
  ...
  call: MyBrokerCall;
  emit: MyBrokerEmit;
  ...
}
```

Don't forget to export your enhanced new moleculer, to use it later in services. 

For instance, let's name it `typd-moleculer.ts`

```typescript
import * as Moleculer from 'path/to/typedef/moleculer';
export = Moleculer;
```
 
Then, replace a `moleculer` library in your service with your new enhanced typed moleculer


```typescript
// replace
import { Service, Context } from 'moleculer';

// with
import { Service, Context } from 'path/to/typed-moleculer';
```

### Source code

Check the source code of our examples. 

For our services, we are using ColonelBundy's [moleculer-decorators](https://github.com/ColonelBundy/moleculer-decorators). Kudos for his great library 

| example | Description |
| ------- | ----------- |
| [single-broker](single-broker) | Simple example with one standard broker |
| [multiple-broker](multiple-broker) | If you have a multiple brokers with their own separeted services, you can easily generate the types for them aswell |
| [empty-broker](empty-broker) | In this example, we are demonstrating the moleculer's native internal services/actions, for which can be types also generated (if needed) |
