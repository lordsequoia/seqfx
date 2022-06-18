import { Domain, Effect } from 'effector';

import { File, StorageOperations, WithData } from '.';

export type UseStorageEffects = {
  readonly context: Domain;
  readonly operations: StorageOperations;
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

/**
 * Use storage effects. Call them to run, watch for calls.
 *
 * @param options
 * @returns
 */
export const useStorageEffects = (
  options: UseStorageEffects
): StorageEffects => {
  const { context, operations } = options;

  // Destructure options
  const { effect } = context;
  const { read, write, exists } = operations;

  // Initialize effects
  const $read = effect(read);
  const $write = effect(write);
  const $exists = effect(exists);

  return { $read, $write, $exists };
};
