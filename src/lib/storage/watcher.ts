import * as chokidar from 'chokidar';
import { Event, fromObservable } from 'effector';
import { fromEvent } from 'rxjs';

import { StorageEvents } from './events';
import { File, FileEvent } from './types';

export type UseStorageWatcher = {
  readonly cwd: string;
  readonly events: StorageEvents;
};

export type StorageWatcher = {
  readonly add: Event<FileEvent>;
  readonly addDir: Event<FileEvent>;
  readonly change: Event<FileEvent>;
  readonly unlink: Event<FileEvent>;
  readonly unlinkDir: Event<FileEvent>;
};

export const useStorageWatcher = (
  options: UseStorageWatcher
): StorageWatcher => {
  const watcher = chokidar.watch('.', { cwd: options.cwd });

  const trigger = fromEvent(watcher, 'all');
  const fileEvent = fromObservable<FileEvent>(trigger);
  const filterFileEvent = (name: string): Event<FileEvent> =>
    fileEvent.filter({
      fn: ([eventName]) => eventName === name,
    });

  const add = filterFileEvent('add');
  const addDir = filterFileEvent('addDir');
  const change = filterFileEvent('change');
  const unlink = filterFileEvent('unlink');
  const unlinkDir = filterFileEvent('unlinkDir');

  const { seen, changed, deleted } = options.events;

  const shape = (value: FileEvent): File => {
    return { path: value[1], stats: value[2] };
  };

  add.watch((payload) => seen(shape(payload)));
  unlink.watch((payload) => deleted(shape(payload)));
  change.watch((payload) => changed(shape(payload)));

  return { add, addDir, change, unlink, unlinkDir };
};
