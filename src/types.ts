export interface EventProps<T> {
  eventName?: string;
  id?: string;
  group?: string;
  callback?: (data: T) => void;
}

export interface EventData<T> {
  eventName: string;
  id?: string;
  group?: string;
  callback: (data: T) => void;
  observe?: (string | number)[];
}

export interface EventTriggerArgs<T> {
  eventName: string;
  data?: T;
  observe?: (string | number)[];
}
