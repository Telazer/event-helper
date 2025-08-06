import { EventData, EventProps } from "./types";

export class EventHelper<T> {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  static events: Record<string, EventHelper<any>> = {};

  static on<T>(data: EventData<T>) {
    const { eventName, id, group, callback } = data;
    if (EventHelper.events[eventName]) {
      const existingEvent = EventHelper.events[eventName];
      if (id) {
        const existingIdIndex = existingEvent.callbacksList.findIndex(
          (cb) => cb.id === id
        );
        if (existingIdIndex >= 0) {
          // Check if callback already exists
          if (
            !existingEvent.callbacksList[existingIdIndex].callbacks.includes(
              callback
            )
          ) {
            existingEvent.callbacksList[existingIdIndex] = {
              callbacks: [callback],
              id,
              group,
            };
          }
        } else {
          existingEvent.callbacksList.push({
            callbacks: [callback],
            id,
            group,
          });
        }
      } else if (group) {
        const existingIdIndex = existingEvent.callbacksList.findIndex(
          (cb) => cb.group === group
        );
        if (existingIdIndex >= 0) {
          // Check if callback already exists
          if (
            !existingEvent.callbacksList[existingIdIndex].callbacks.includes(
              callback
            )
          ) {
            existingEvent.callbacksList[existingIdIndex].callbacks.push(
              callback
            );
          }
        } else {
          existingEvent.callbacksList.push({
            callbacks: [callback],
            id,
            group,
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
          });
        }
      }
      return existingEvent;
    } else {
      const event = new EventHelper(callback, id, group);
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
      ].callbacksList.filter((cb) => {
        return cb.group !== group;
      });
    } else {
      EventHelper.events[eventName].callbacksList = [];
    }
  }

  static dispatch<T>(eventName: string, data?: T) {
    if (!EventHelper.events[eventName]) return;
    EventHelper.events[eventName].callbacksList.forEach((callback) =>
      callback.callbacks.forEach((cb) => cb(data))
    );
  }

  private callbacksList: {
    callbacks: ((data: T) => void)[];
    id?: string;
    group?: string;
  }[] = [];

  constructor(callback: (data: T) => void, id?: string, group?: string) {
    this.callbacksList.push({ callbacks: [callback], id, group });
  }
}
