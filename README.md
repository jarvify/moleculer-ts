# moleculer-ts

## Description

moleculer-ts is a tool which generate [moleculer](https://github.com/moleculerjs/moleculer) types for your sevices actions & events.

## Features

- Generate types for call, emit, broadcast, broadcastLocal functions
- Customizable Broker & Service interface
- Automatic regeneration of types on files change - generateBrokerWatch
- Using ts-patch & ts-transformer-enumerate - please follow installation instructions

## Installation

```
npm i moleculer  moleculer-decorators moleculer-ts --save

npm i typescript ts-patch ts-transformer-enumerate prettier @types/node -D

node_modules/.bin/ts-patch install
```

### Add to your tsconfig.json

```
{
  "compilerOptions": {
    "plugins": [
      { "transform": "ts-transformer-enumerate/transformer" },
    ]
  }
}
```

### Example

```

```
