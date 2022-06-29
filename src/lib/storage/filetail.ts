import { existsSync } from 'node:fs'
import { join, normalize, resolve } from 'node:path'

import { Observable } from 'rxjs'
import { Tail } from 'tail'

export type Filetail = {
    readonly stream$: (path: string) => Observable<string>
}

export const useFiletail = ({ rootDir }: { readonly rootDir?: string }): Filetail => {
    const cwd = resolve(normalize(rootDir || '.'))

    const path = (v?: string) => v === undefined ? cwd : join(cwd, normalize(v))

    const stream$ = (v: string) =>
        new Observable<string>(subscriber => {
            const filepath = path(v)

            if (!existsSync(filepath)) {
                subscriber.error({ message: 'File not found' })
                subscriber.complete()
                return
            }

            const tail = new Tail(filepath)
            tail.on('line', line => subscriber.next(line))
            tail.on('error', err => subscriber.error(err))
        })

    return { stream$ }
}