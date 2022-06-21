/* eslint-disable functional/no-mixed-type */
/* eslint-disable functional/prefer-readonly-type */
import { createDomain, createStore, Domain, Event, Store } from 'effector';

/**
 * Type for a reactive array. @see array$
 */
export type Array$<T = unknown> = {
  readonly $values: Store<readonly T[]>;

  readonly push: Event<T>;
  readonly update: Event<T>;
  readonly remove: Event<T>;
  readonly reset: Event<void>;

  readonly find: (key: keyof T, value: T[keyof T]) => readonly T[];
  readonly $filter: (fn: (v: T) => boolean) => Store<T[]>;
  readonly $map: <S>(fn: (v: T) => S) => Store<S[]>;
  // readonly $mapAsync: <S>(fn: (v: T) => Promise<S>) => Promise<Store<S[]>>;
};

/**
 * Use none, some or all of these to initialize a reactive array.
 */
export type ArrayOpts$<T = unknown> = {
  readonly domain: Domain;
  readonly key: keyof T;
  readonly eq: (a: T, b: T) => boolean;
};

/**
 * A reactive array.
 *
 * @param options none, one, some or all of @see ArrayOpts$
 *
 * @returns
 */
export const array$ = <T = unknown>(
  options?: Partial<ArrayOpts$<T>>
): Array$<T> => {
  const domain = options?.domain || createDomain();

  const push = domain.createEvent<T>();
  const update = domain.createEvent<T>();
  const remove = domain.createEvent<T>();
  const reset = domain.createEvent<void>();

  const eq =
    options?.eq !== undefined
      ? options.eq
      : (a: T, b: T) =>
          a === b ||
          (options && options.key && a[options.key] === b[options.key]);

  const $values = (domain === undefined ? createStore : domain.createStore)<
    readonly T[]
  >([])
    .on(push, (state: readonly T[], value: T) => [...state, value])
    .on(remove, (state: readonly T[], value: T) =>
      state.filter((v) => eq(v, value))
    )
    .on(update, (state: readonly T[], value: T) =>
      state.map((v) => (eq(v, value) ? value : v))
    )
    .reset(reset);

  const $map = <S>(fn: (v: T) => S) => $values.map((state) => state.map(fn));

  const $filter = (fn: (v: T) => boolean) =>
    $values.map((state) => state.filter(fn));

  const find = (key: keyof T, value: T[keyof T]) =>
    $values.getState().filter((v) => v[key] === value);

  return {
    $values,
    push,
    update,
    remove,
    reset,
    find,
    $filter,
    $map,
  };
};
