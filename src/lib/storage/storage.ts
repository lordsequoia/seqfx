/* eslint-disable import/order */
import { createDomain, Domain } from 'effector';
import { resolve as resolvePath } from 'node:path';
import { Observable } from 'rxjs';

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
import { Array$, array$ } from '../shapes';
import { Filetail, useFiletail } from './filetail';

export type Storage = {
  readonly cwd: string;
  readonly context: Domain;
  readonly files$: Array$<File>;
};

export type Addons = StorageEvents &
  StorageEffects &
  StorageOperations &
  StorageWatcher &
  Filetail;

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
  const watcher = useStorageWatcher({ cwd, events, context });
  const { stream$ } = useFiletail({ rootDir: cwd })
  const { seen, created, deleted, changed } = events;
  const { $read } = effects;

  const files$ = array$<File>({ domain: context, key: 'path' });

  const { $values, push, update, remove } = files$;

  $values.on($read.doneData, (state, payload) =>
    state.map((v) => (v.path === payload.path ? payload : v))
  );

  $read.doneData.watch(files$.update);

  seen.watch(push);
  created.watch(push);
  changed.watch(update);
  deleted.watch(remove);

  return Object.assign(
    { cwd, context, files$ },
    watcher,
    operations,
    events,
    effects,
    stream$,
  );
};
