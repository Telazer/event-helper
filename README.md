# Telazer - EventHelper

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/Telazer/event-helper)

For more helpers and utilities, check out the [Telazer NPM Page](https://www.npmjs.com/org/telazer)

A TypeScript utility library for creating and managing custom event handlers.

---

## Installation

```typescript
npm install @telazer/event-helper
```

---

## Key Features

- Create and manage custom events with type-safe data passing
- Flexible event handling with callback, ID, and group-based subscriptions
- Singleton pattern implementation for global event management using a static class
- Efficient app-wide communication and state management
- Granular control over event listener removal (by callback, name, ID, or group)
- Precise event dispatching with filtered subscriber targeting

---

## Usage

Import `EventHelper`:

```ts
import EventHelper from "@telazer/event-helper";
```

### Dispatching

```ts
button.onClick = () => {
  EventHelper.dispatch("state_change");
};
```

### Start Listening (ON)

```ts
EventHelper.on({
  eventName: "state_change",
  callback: () => {
    console.log("state_change triggered");
  },
});
```

### Passing data with type

```ts
interface IEventData {
  foo: string;
}

button.onClick = () => {
  EventHelper.dispatch<IEventData>("state_change", { foo: "bar" });
};

EventHelper.on<IEventData>({
  eventName: "state_change",
  callback: ({ foo }) => {
    console.log("state_change triggered", foo);
  },
});
```

### Stop Listening (OFF)

```ts
// Stop all listeners for `state_change`
EventHelper.off({
  eventName: "state_change",
});
```

### Using callback as matcher

```ts
// Listener 1
const callbackFc = () => {
  console.log("state_change triggered from listener1");
};

EventHelper.on({
  eventName: "state_change",
  callback: callbackFc,
});

// Listener 2
EventHelper.on({
  eventName: "state_change",
  callback: () => {
    console.log("state_change triggered from listener2");
  },
});

// Stop listener 1 by passing the callbackFc instance
EventHelper.off({ callback: callbackFc });

// Listener 2 is still active
```

### Using ID as matcher

> Note: Using `id` will override the previous listener with the same `eventName` and `id`.

```ts
// Listener 1
EventHelper.on({
  id: "listener1",
  eventName: "state_change",
  callback: () => {
    console.log("state_change triggered from listener1");
  },
});

// Listener 2
EventHelper.on({
  id: "listener2",
  eventName: "state_change",
  callback: () => {
    console.log("state_change triggered from listener2");
  },
});

// Stop listener 1 by passing the ID
EventHelper.off({ id: "listener1" });

// Listener 2 is still active
```

### Grouping

```ts
// Listener 1
EventHelper.on({
  group: "group1",
  eventName: "state_change",
  callback: () => {
    console.log("state_change triggered from group1");
  },
});
// Listener 2
EventHelper.on({
  group: "group1",
  eventName: "state_change",
  callback: () => {
    console.log("state_change triggered from group1");
  },
});
// Listener 3
EventHelper.on({
  group: "group2",
  eventName: "state_change",
  callback: () => {
    console.log("state_change triggered from group2");
  },
});

// Stop listeners 1 and 2 by passing the group name
EventHelper.off({ group: "group1" });

// Listener 3 is still active
```

### Stop all, yes ALL

```ts
// Stop ALL the listeners
EventHelper.off();
```

---

## Development

```bash
# Clone the repo
git clone https://github.com/Telazer/event-helper

# Install dependencies
npm install

# Start the watcher for development
npm run watch

# Build the library
npm run build
```

---

## License

MIT License

Copyright (c) 2025 Telazer LLC.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rightsto use, copy, modify, merge, publish, distribute, sublicense, and/or sellcopies of the Software, and to permit persons to whom the Software isfurnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in allcopies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS ORIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THEAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHERLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THESOFTWARE.
