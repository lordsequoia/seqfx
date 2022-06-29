/* eslint-disable functional/no-throw-statement */
import { join } from 'path';

import { Domain, Effect, Event, fromObservable } from 'effector';
import { Observable } from 'rxjs';

export type StreamFile = (path: string) => Observable<string>;
export type StreamFx = Effect<string, Observable<string>, Error>;

export type UseLogtail = {
  readonly context?: Domain;
  readonly tail: StreamFile;
};

export type RawLog = string;
export type RawLog$ = Event<RawLog>;

export type Logtail = {
  readonly stream: Observable<RawLog>;
  readonly pushedLog: RawLog$;
  readonly pushedMessage: MessageLog$;
};

export const useLatestLogs = (tail: StreamFile) => {
  const stream = tail(join('logs', 'latest.log'));
  const pushedLog = fromObservable<string>(stream);

  return { stream, pushedLog };
};

export type LogLevel = 'INFO' | 'ERROR' | 'WARN' | 'DEBUG';

export type MessageLog = {
  readonly log: RawLog;
  readonly timestamp: string;
  readonly group: string;
  readonly level: LogLevel;
  readonly message: string;
};

export const serverLogRegex = /\[(.*)\] \[(.*)\/(.*)\]: (.*)/m;
export const parseRawLog = (v: RawLog): MessageLog => {
  const result = serverLogRegex.exec(v);

  if (result === undefined || result === null)
    throw new Error(`Not a server log: ${v}`);

  const [timestamp, group, level, message] = result;

  return {
    log: v,
    timestamp,
    group,
    level: level as LogLevel,
    message,
  };
};

export type UseLogMessages = {
  readonly source: RawLog$;
};

export type MessageLog$ = Event<MessageLog>;

export const useLogMessages = (source: RawLog$): MessageLog$ => {
  const filterFn = (v: string) => serverLogRegex.exec(v) !== undefined;
  const mapFn = (v: RawLog) => parseRawLog(v);
  return source.filter({ fn: filterFn }).map<MessageLog>(mapFn);
};

export const useLogtail = (options: UseLogtail): Logtail => {
  const { stream, pushedLog } = useLatestLogs(options.tail);

  const pushedMessage = useLogMessages(pushedLog);

  return { stream, pushedLog, pushedMessage };
};
