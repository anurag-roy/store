export type EventPayloadMap = Record<string, {} | null | undefined>;

export type ExtractEventsFromPayloadMap<T extends EventPayloadMap> = Values<{
  [K in keyof T & string]: T[K] & { type: K };
}>;

export type Recipe<T, TReturn> = (state: T) => TReturn;

export type StoreAssigner<
  TContext extends StoreContext,
  TEvent extends EventObject
> = (context: TContext, event: TEvent) => Partial<TContext>;
export type StoreCompleteAssigner<TContext, TEvent extends EventObject> = (
  ctx: TContext,
  ev: TEvent
) => TContext;
export type StorePartialAssigner<
  TContext,
  TEvent extends EventObject,
  K extends keyof TContext
> = (ctx: TContext, ev: TEvent) => Partial<TContext>[K];
export type StorePropertyAssigner<TContext, TEvent extends EventObject> = {
  [K in keyof TContext]?:
    | TContext[K]
    | StorePartialAssigner<TContext, TEvent, K>;
};

export type Snapshot<TOutput> =
  | {
      status: 'active';
      output: undefined;
      error: undefined;
    }
  | {
      status: 'done';
      output: TOutput;
      error: undefined;
    }
  | {
      status: 'error';
      output: undefined;
      error: unknown;
    }
  | {
      status: 'stopped';
      output: undefined;
      error: undefined;
    };

export type StoreSnapshot<TContext> = Snapshot<undefined> & {
  context: TContext;
};

/**
 * An actor-like object that:
 * - has its own state
 * - can receive events
 * - is observable
 */
export interface Store<TContext, Ev extends EventObject>
  extends Subscribable<StoreSnapshot<TContext>, Ev>,
    InteropObservable<StoreSnapshot<TContext>, Ev> {
  send: (event: Ev) => void;
  getSnapshot: () => StoreSnapshot<TContext>;
  getInitialSnapshot: () => StoreSnapshot<TContext>;
}

export type SnapshotFromStore<TStore extends Store<any, any>> =
  TStore extends Store<infer TContext, any> ? StoreSnapshot<TContext> : never;

// Copied from XState core and modified
// -----------------------

export interface InteropSubscribable<T, Ev extends EventObject> {
  subscribe(observer: Observer<T, Ev>): Subscription;
}

interface InteropObservable<T, Ev extends EventObject> {
  [Symbol.observable]: () => InteropSubscribable<T, Ev>;
}

// Based on RxJS types
export type Observer<T, Ev extends EventObject> = {
  next?: (value: T, event: Ev) => void;
  error?: (err: unknown) => void;
  complete?: () => void;
};

export interface Subscription {
  unsubscribe(): void;
}

export interface Subscribable<T, Ev extends EventObject>
  extends InteropSubscribable<T, Ev> {
  subscribe(observer: Observer<T, Ev>): Subscription;
  subscribe(
    next: (value: T, event: Ev) => void,
    error?: (error: any) => void,
    complete?: () => void
  ): Subscription;
}

// Same as MachineContext (for now)
export type StoreContext = Record<string, any>;

/**
 * The full definition of an event, with a string `type`.
 */
export type EventObject = {
  /**
   * The type of event that is sent.
   */
  type: string;
};
type Values<T> = T[keyof T];
