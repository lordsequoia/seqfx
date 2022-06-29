import { createStore, Domain, Store } from 'effector';

export type State<T> = Store<Partial<T>>;

export const useState = <T>(
  initialState: Partial<T> | undefined,
  context?: Domain
): Store<Partial<T>> => {
  const domain = context || { createStore };

  return domain.createStore<Partial<T>>(initialState || {}) as State<T>;
};
