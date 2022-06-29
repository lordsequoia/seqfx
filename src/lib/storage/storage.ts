/* eslint-disable import/order */
import { createDomain, Domain } from 'effector';
import { resolve as resolvePath } from 'node:path';

import {
  createStorageEffects,
  File,
  StorageEffects,
  StorageEvents,
  StorageOperations,
  StorageWatcher,
  useDefaultStorageEffects,
  useDefaultStorageOperations,
  useStorageEvents,
  useStorageWatcher,
  With,
} from '.';
import { Array$, array$ } from '../shapes';
import { Filetail, useFiletail } from './filetail';
import { StreamFile } from '../logtail/index';

export type FileArray$ = Array$<File>;

export type Storage = {
  readonly cwd: string;
  readonly context: Domain;
  readonly $files: FileArray$;
};

export type Addons = StorageEvents & StorageEffects & StorageWatcher & Filetail;

export type StorageWithAddons = With<Storage, Addons>;

/**
 * Bootstrap a reactive storage with addons.
 *
 * @param rootDir The directory to use as root dir for the storage.
 * @returns
 */
export const useStorage = (options: {
  readonly context?: Domain;
  readonly rootDir?: string;
  readonly events?: StorageEvents;
  readonly operations?: StorageOperations;
  readonly effects?: StorageEffects;
  readonly watcher?: StorageWatcher;
  readonly tail?: StreamFile;
}): StorageWithAddons => {
  const cwd = resolvePath(options.rootDir || '.');

  const context =
    options.context === undefined
      ? createDomain('storage')
      : options.context.createDomain('storage');

  const effects =
    options.effects ||
    useDefaultStorageEffects({
      context,
      operations: options.operations || useDefaultStorageOperations(cwd),
      effects: createStorageEffects(context),
    });

  const events = options.events || useStorageEvents(context);
  const { seen, created, deleted, changed } = events;

  const watcher =
    options.watcher || useStorageWatcher({ cwd, events, context });

  const stream$ =
    options.operations.tail || useFiletail({ rootDir: cwd }).stream$;

  const { $read } = effects;

  const $files = array$<File>({ domain: context, key: 'path' });

  const { $values, push, update, remove } = $files;

  $values.on($read.doneData, (state, payload) =>
    state.map((v) => (v.path === payload.path ? payload : v))
  );

  $read.doneData.watch($files.update);

  seen.watch(push);
  created.watch(push);
  changed.watch(update);
  deleted.watch(remove);

  return Object.assign(
    {
      cwd,
      context,
      $files,
      stream$,
    },
    watcher,
    events,
    effects
  );
};
