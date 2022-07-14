import { createEffect, Domain, Effect } from 'effector';

import { File, StorageOperations, WithData } from '.';

export type UseStorageEffects = {
  readonly context: Domain;
  readonly operations: StorageOperations;
  readonly effects?: StorageEffects;
};

export type ReadFileEffect = Effect<File, WithData<File>, Error>;
export type WriteFileEffect = Effect<WithData<File>, WithData<File>, Error>;
export type ExistsFileEffect = Effect<
  { readonly path: string },
  boolean,
  Error
>;

export type StorageEffects = {
  readonly $read: ReadFileEffect;
  readonly $write: WriteFileEffect;
  readonly $exists: ExistsFileEffect;
};

export const createStorageEffects = (context?: Domain) => {
  const { effect } = context !== undefined ? context : { effect: createEffect };

  // Initialize effects
  const $read = effect<File, WithData<File>, Error>();
  const $write = effect<WithData<File>, WithData<File>, Error>();
  const $exists = effect<{ readonly path: string }, boolean, Error>();

  return { $read, $write, $exists };
};

/**
 * Use storage effects. Call them to run, watch for calls.
 *
 * @param options
 * @returns
 */
export const useDefaultStorageEffects = (
  options: UseStorageEffects
): StorageEffects => {
  const { effects } = options;

  const { $read, $write, $exists } =
    effects || createStorageEffects(options.context);

  $read.use(options.operations.read);
  $write.use(options.operations.write);
  $exists.use(options.operations.exists);

  return { $read, $write, $exists };
};
