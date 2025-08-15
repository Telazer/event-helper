// EventHelper.ts (sende zaten var, sadece imza aynı kalsın)
// Tek gerekli değişiklik: on() da callback artık zorunlu tipte, ek bir değişiklik yok.
// Aşağıdaki dosyanı aynen kullanmaya devam edebilirsin.

import { EventData, EventProps } from "./types";

export class EventHelper<T> {
  static events: Record<string, EventHelper<any>> = {};

  static on<T>(data: EventData<T>) {
    const { eventName, id, group, callback, observe } = data;
    if (EventHelper.events[eventName]) {
      const existingEvent = EventHelper.events[eventName];

      if (id) {
        const existingIdIndex = existingEvent.callbacksList.findIndex(
          (cb) => cb.id === id
        );
        if (existingIdIndex >= 0) {
          const entry = existingEvent.callbacksList[existingIdIndex];
          if (!entry.callbacks.includes(callback)) {
            existingEvent.callbacksList[existingIdIndex] = {
              ...entry,
              callbacks: [callback],
              observe: observe ?? entry.observe,
            };
          }
        } else {
          existingEvent.callbacksList.push({
            callbacks: [callback],
            id,
            group,
            observe,
          });
        }
      } else if (group) {
        const existingGroupIndex = existingEvent.callbacksList.findIndex(
          (cb) => cb.group === group
        );
        if (existingGroupIndex >= 0) {
          const entry = existingEvent.callbacksList[existingGroupIndex];
          if (!entry.callbacks.includes(callback)) {
            entry.callbacks.push(callback);
          }
          if (observe) entry.observe = observe;
        } else {
          existingEvent.callbacksList.push({
            callbacks: [callback],
            id,
            group,
            observe,
          });
        }
      } else {
        const hasCallback = existingEvent.callbacksList.some((cb) =>
          cb.callbacks.includes(callback)
        );

        if (!hasCallback) {
          existingEvent.callbacksList.push({
            callbacks: [callback],
            id,
            group,
            observe,
          });
        }
      }
      return existingEvent;
    } else {
      const event = new EventHelper(callback, id, group, observe);
      EventHelper.events[eventName] = event;
      return event;
    }
  }

  static off<T>(props?: EventProps<T>) {
    if (!props) {
      EventHelper.events = {};
      return;
    }

    const { eventName, callback, id, group } = props || {};
    if (!eventName) {
      EventHelper.events = {};
      return;
    }

    if (!EventHelper.events[eventName]) return;

    if (callback) {
      EventHelper.events[eventName].callbacksList = EventHelper.events[
        eventName
      ].callbacksList.map((cb) => {
        return {
          ...cb,
          callbacks: cb.callbacks.filter((cbb) => cbb !== callback),
        };
      });
    } else if (group) {
      EventHelper.events[eventName].callbacksList = EventHelper.events[
        eventName
      ].callbacksList.filter((cb) => cb.group !== group);
    } else if (id) {
      EventHelper.events[eventName].callbacksList = EventHelper.events[
        eventName
      ].callbacksList.filter((cb) => cb.id !== id);
    } else {
      EventHelper.events[eventName].callbacksList = [];
    }

    // cleanup
    EventHelper.events[eventName].callbacksList = EventHelper.events[
      eventName
    ].callbacksList.filter((cb) => cb.callbacks.length > 0);

    if (EventHelper.events[eventName].callbacksList.length === 0) {
      delete EventHelper.events[eventName];
    }
  }

  static dispatch<T>(eventName: string, data?: T) {
    if (!EventHelper.events[eventName]) return;
    EventHelper.events[eventName].callbacksList.forEach((entry) =>
      entry.callbacks.forEach((cb) => cb(data))
    );
  }

  static trigger<T>(args: {
    eventName: string;
    data?: T;
    observe?: (string | number)[];
  }) {
    const { eventName, data, observe } = args;
    const event = EventHelper.events[eventName];
    if (!event) return;

    if (!observe || observe.length === 0) {
      event.callbacksList.forEach((entry) =>
        entry.callbacks.forEach((cb) => cb(data))
      );
      return;
    }

    const wanted = new Set(observe.map(String));

    event.callbacksList.forEach((entry) => {
      if (!entry.observe || entry.observe.length === 0) {
        entry.callbacks.forEach((cb) => cb(data));
        return;
      }
      const sub = entry.observe.map(String);
      const match = sub.some((k) => wanted.has(k));
      if (!match) return;
      entry.callbacks.forEach((cb) => cb(data));
    });
  }

  private callbacksList: {
    callbacks: ((data: T) => void)[];
    id?: string;
    group?: string;
    observe?: (string | number)[];
  }[] = [];

  constructor(
    callback: (data: T) => void,
    id?: string,
    group?: string,
    observe?: (string | number)[]
  ) {
    this.callbacksList.push({ callbacks: [callback], id, group, observe });
  }
}
