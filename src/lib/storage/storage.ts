/* eslint-disable functional/immutable-data */
import { resolve as resolvePath } from 'node:path';

import { createDomain, Domain, Store } from 'effector';

import {
  File,
  StorageEffects,
  StorageEvents,
  StorageOperations,
  StorageWatcher,
  useStorageEffects,
  useStorageEvents,
  useStorageOperations,
  useStorageWatcher,
  With,
} from '.';

export type Storage = {
  readonly cwd: string;
  readonly context: Domain;
  readonly $files: Store<readonly File[]>;
};

export type Addons = StorageEvents &
  StorageEffects &
  StorageOperations &
  StorageWatcher;

export type StorageWithAddons = With<Storage, Addons>;

/**
 * Bootstrap a reactive storage with addons.
 *
 * @param rootDir The directory to use as root dir for the storage.
 * @returns
 */
export const useStorage = (rootDir?: string): StorageWithAddons => {
  const cwd = rootDir || resolvePath('.');

  const context = createDomain('storage');
  const operations = useStorageOperations(cwd);
  const effects = useStorageEffects({ context, operations });
  const events = useStorageEvents(context);
  const watcher = useStorageWatcher({ cwd, events });

  const { store } = context;
  const { seen, created, deleted, changed } = events;
  const { $read } = effects;

  const $files = store<readonly File[]>([])
    .on($read.doneData, (state, payload) => [...state, payload])
    .on(seen, (state, payload) => [...state, payload])
    .on(created, (state, payload) => [...state, payload])
    .on(changed, (state, payload) =>
      state.map((v) => (v.path === payload.path ? payload : v))
    )
    .on(deleted, (state, payload) =>
      state.filter((v) => v.path !== payload.path)
    );

  const storage = { cwd, context, $files };

  return Object.assign(storage, watcher, operations, events, effects);
};
