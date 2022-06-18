import { Stats } from 'node:fs';

export type FileDefinition = {
  readonly path: string;
  readonly stats: Stats;
};

export type With<T, W> = T & W;
export type WithMaybe<T, W> = T & Partial<W>;
export type WithData<T> = With<T, { readonly data: Buffer }>;
export type WithPath<T = undefined> = With<T, { readonly path: string }>;
export type WithMaybeStats<T = undefined> = T &
  Partial<{ readonly stats: Stats }>;

export type FileRef = WithMaybe<
  { readonly path: string },
  { readonly stats: Stats }
>;
export type File = WithMaybe<FileRef, { readonly data: Buffer }>;

export type FileEvent = readonly [
  eventName: string,
  path: string,
  stats?: Stats
];
