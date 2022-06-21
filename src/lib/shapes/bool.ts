import { createDomain, Domain, Event, Store } from 'effector';

export type Bool$ = {
  readonly $value: Store<boolean>;

  readonly toggle: Event<void>;
  readonly setTrue: Event<void>;
  readonly setFalse: Event<void>;
};

export type BoolOpts$ = {
  readonly domain: Domain;
  readonly initialValue: boolean;
};

export const bool$ = (options?: Partial<BoolOpts$>): Bool$ => {
  const domain = options?.domain || createDomain();

  const setTrue = domain.createEvent();
  const setFalse = domain.createEvent();
  const toggle = domain.createEvent();

  const $value = domain
    .createStore<boolean>(options?.initialValue === true)
    .on(setTrue, () => true)
    .on(toggle, (state) => !state)
    .reset(setFalse);

  return { $value, toggle, setTrue, setFalse };
};
