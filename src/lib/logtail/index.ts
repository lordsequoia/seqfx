import { join } from "path";

import { Domain, Event, fromObservable } from "effector";
import { Observable } from "rxjs";

export type StreamFunction = (path: string) => Observable<string>

export type UseLogtail = {
    readonly context?: Domain
    readonly stream$: StreamFunction
}

export type Logtail = {
    readonly rawLogs: Event<string>
}

export const useRawLogs = (fn: StreamFunction) => {
    const stream = fn(join('logs', 'latest.log'))

    const rawLogs = fromObservable<string>(stream)

    return { stream, rawLogs }
}

export const useLogtail = (options: UseLogtail): Logtail => {
    const { rawLogs } = useRawLogs(v => options.stream$(v))

    return { rawLogs }
}