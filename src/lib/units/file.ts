import { Effect, Store } from 'effector';
import { Moment } from 'moment';

import { State } from '../shapes/state';

export type FilePath = {
  readonly path: string;
};

export type FileData = {
  readonly data: Buffer;
};

export type FileStats = {
  readonly size: number;
  readonly createdAt: Moment;
  readonly changedAt: Moment;
};

export type ReadFileFx = Effect<string | FilePath, FileRef, Error>;
export type WriteFileFx = Effect<FileData & FilePath, FileRef, Error>;
export type ExistsFileFx = Effect<string | FilePath, boolean, Error>;

export type FileInfo = {
  readonly filename: string;
  readonly extension: string;
};

export type FileRef = FilePath & Partial<FileInfo & FileStats>;

export type File$ = Store<readonly [path: string, file: FileRef]>;

export type FileState = State<FileRef>;
