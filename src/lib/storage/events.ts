/* eslint-disable functional/no-mixed-type */
import { Domain, Event } from 'effector';
import { isMatch } from 'micromatch';

import { File } from '.';

export type StorageEvents = {
  readonly seen: Event<File>;
  readonly created: Event<File>;
  readonly deleted: Event<File>;
  readonly changed: Event<File>;
  readonly when: (
    event: Event<File>,
    pattern: string | readonly string[]
  ) => Event<File>;
};

export const useStorageEvents = (context: Domain): StorageEvents => {
  const { event } = context;

  const seen = event<File>();
  const created = event<File>();
  const deleted = event<File>();
  const changed = event<File>();

  const when = (event: Event<File>, pattern: string | readonly string[]) =>
    event.filter({ fn: (payload) => isMatch(payload.path, pattern) });

  return { seen, created, deleted, changed, when };
};
