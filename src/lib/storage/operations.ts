/* eslint-disable functional/immutable-data */
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve as resolvePath } from 'node:path';

import { StreamFile } from '../logtail';

import { File, WithData } from '.';
import { useFiletail } from './filetail';

// eslint-disable-next-line functional/no-mixed-type
export type StorageOperations = {
  readonly read: (file: File) => Promise<WithData<File>>;
  readonly write: (file: WithData<File>) => Promise<WithData<File>>;
  readonly exists: ({ path }: { readonly path: string }) => Promise<boolean>;
  readonly tail: StreamFile;
};

export const useDefaultStorageOperations = (cwd: string): StorageOperations => {
  const read = async (file: File): Promise<WithData<File>> => {
    const buffer = await readFile(resolvePath(cwd, file.path));

    return Object.assign(file, { data: buffer });
  };

  const write = async (file: WithData<File>): Promise<WithData<File>> => {
    return new Promise<WithData<File>>((resolve) => {
      writeFile(file.path, file.data).then(() => resolve(file));
    });
  };

  const exists = async ({
    path,
  }: {
    readonly path: string;
  }): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      const fileExists = existsSync(resolvePath(cwd, path));
      resolve(fileExists);
    });
  };

  const tail = useFiletail({ rootDir: cwd }).stream$;

  return { read, write, exists, tail };
};
