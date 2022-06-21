import * as chokidar from 'chokidar';
import { Domain, Event, fromObservable, Store } from 'effector';
import { fromEvent } from 'rxjs';

import { bool$ } from '../shapes';

import { StorageEvents } from './events';
import { File, FileEvent } from './types';

export type UseStorageWatcher = {
  readonly cwd: string;
  readonly events: StorageEvents;
  readonly context?: Domain;
  readonly paths?: string | readonly string[];
};

export type StorageWatcher = {
  readonly $ready: Store<boolean>;
  readonly add: Event<FileEvent>;
  readonly addDir: Event<FileEvent>;
  readonly change: Event<FileEvent>;
  readonly unlink: Event<FileEvent>;
  readonly unlinkDir: Event<FileEvent>;
};

export const useStorageWatcher = (
  options: UseStorageWatcher
): StorageWatcher => {
  const { $value: $ready, setTrue: setReady } = bool$({
    domain: options.context,
  });

  const watcher = chokidar.watch(options.paths || '.', { cwd: options.cwd });

  const $isReady = fromObservable(fromEvent(watcher, 'ready'));

  $isReady.watch(() => setReady());

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

  const { seen, created, changed, deleted } = options.events;

  const shape = (value: FileEvent): File => {
    return { path: value[1], stats: value[2] };
  };

  add.watch((payload) =>
    ($ready.getState() === true ? created : seen)(shape(payload))
  );
  unlink.watch((payload) => deleted(shape(payload)));
  change.watch((payload) => changed(shape(payload)));

  return { $ready, add, addDir, change, unlink, unlinkDir };
};
