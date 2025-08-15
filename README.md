# Telazer - EventHelper

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/Telazer/event-helper)

For more helpers and utilities, check out the [Telazer NPM Page](https://www.npmjs.com/org/telazer)

A TypeScript utility library for creating and managing custom event handlers.

---

## Installation

```bash
npm install @telazer/event-helper
```

---

## Key Features

- Create and manage custom events with type-safe data passing.
- Flexible event handling with callback, ID, and group-based subscriptions.
- Singleton pattern implementation for global event management using a static class.
- Efficient app-wide communication and state management.
- Granular control over event listener removal by callback, name, ID, or group.
- Precise subscriber targeting with `observe` keys via `trigger`.
- Backward compatible with `dispatch` while you migrate.

---

## Usage

Import `EventHelper`:

```ts
import EventHelper from "@telazer/event-helper";
```

---

### Targeted Triggering with `observe`

```ts
// subscribe to only "gold" changes
EventHelper.on({
  eventName: "ITEM_CHANGE",
  observe: ["gold"],
  callback: (data) => {
    console.log("gold changed:", data);
  },
});

// subscribe to only "diamond" changes
EventHelper.on({
  eventName: "ITEM_CHANGE",
  observe: ["diamond"],
  callback: (data) => {
    console.log("diamond changed:", data);
  },
});

// emit only for "gold" observers
EventHelper.trigger({
  eventName: "ITEM_CHANGE",
  observe: ["gold"],
  data: { amount: 5 },
});
```

Notes:

- If a subscriber does not provide `observe`, it will be called by `trigger` for compatibility.
- If `trigger` is called without `observe`, it behaves like `dispatch` and calls all subscribers of that event.

---

### Start Listening (ON)

```ts
EventHelper.on({
  eventName: "state_change",
  callback: () => {
    console.log("state_change triggered");
  },
});
```

---

### Passing Data with Types

```ts
interface IEventData {
  foo: string;
}

EventHelper.trigger<IEventData>({
  eventName: "state_change",
  data: { foo: "bar" },
});

EventHelper.on<IEventData>({
  eventName: "state_change",
  callback: ({ foo }) => {
    console.log("state_change triggered", foo);
  },
});
```

---

### Using Callback as Matcher

```ts
const callbackFc = () => {
  console.log("state_change from listener1");
};

EventHelper.on({
  eventName: "state_change",
  callback: callbackFc,
});

EventHelper.on({
  eventName: "state_change",
  callback: () => {
    console.log("state_change from listener2");
  },
});

// remove listener 1 by its callback reference
EventHelper.off({ eventName: "state_change", callback: callbackFc });

// listener 2 is still active
```

---

### Using ID as Matcher

> Important:
>
> - Using `id` will replace the previous listener with the same `eventName` and `id`.
> - When calling `off()` with `id`, you must also provide `eventName`.
>   If you call `off({ id: "someId" })` without `eventName`, all events will be removed.

```ts
EventHelper.on({
  id: "listener1",
  eventName: "state_change",
  callback: () => console.log("from listener1"),
});

EventHelper.on({
  id: "listener2",
  eventName: "state_change",
  callback: () => console.log("from listener2"),
});

// remove only listener1
EventHelper.off({ eventName: "state_change", id: "listener1" });
```

---

### Grouping

```ts
EventHelper.on({
  group: "group1",
  eventName: "state_change",
  callback: () => console.log("group1 a"),
});

EventHelper.on({
  group: "group1",
  eventName: "state_change",
  callback: () => console.log("group1 b"),
});

EventHelper.on({
  group: "group2",
  eventName: "state_change",
  callback: () => console.log("group2 a"),
});

// stop all listeners in group1
EventHelper.off({ eventName: "state_change", group: "group1" });
```

---

### Stop All Listeners

```ts
// stop ALL listeners for ALL events
EventHelper.off();
```

---

## Deprecation Notice

- `dispatch(eventName, data?)` is deprecated. Use `trigger({ eventName, data, observe? })`.
- The static event registry remains for backward compatibility. New code should use `trigger` and `observe` for precise targeting.

---

## Migration Guide

Replace:

```ts
EventHelper.dispatch("ITEM_CHANGE", payload);
```

With:

```ts
EventHelper.trigger({ eventName: "ITEM_CHANGE", data: payload });
```

If you only want certain subscribers:

```ts
EventHelper.trigger({
  eventName: "ITEM_CHANGE",
  observe: ["gold", "diamond"],
  data: payload,
});
```

Subscribers can opt in:

```ts
EventHelper.on({
  eventName: "ITEM_CHANGE",
  observe: ["gold"],
  callback: onGoldChange,
});
```

If a subscriber omits `observe`, it will still be called by `trigger` for compatibility. To fully opt in to targeted calls, always provide `observe`.

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
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
