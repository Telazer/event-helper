export interface EventProps<T> {
  eventName?: string;
  id?: string;
  group?: string;
  callback: (data: T) => void;
}

export interface EventData<T> extends Omit<EventProps<T>, "eventName"> {
  eventName: string;
}
