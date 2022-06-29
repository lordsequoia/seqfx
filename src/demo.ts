import { createDomain } from "effector"

import { useStorage } from "./lib"
import { useLogtail } from "./lib/logtail"

function startDemo(rootDir: string, timeout?: number) {
    console.log('starting seqfx demo')
    const demo = createDomain('demo')

    const storage = useStorage({ context: demo, rootDir })

    console.log(`using storage: ${storage.cwd}`, { stream$: storage.stream$ })

    const { rawLogs } = useLogtail(storage)

    const demoLogtail = () => {
        console.log(`loading logtail for: ${rootDir}`)

        return rawLogs.watch(rawLog => console.log(`RAW LOG -> ${rawLog}`))
    }

    const logtailDemo = demoLogtail()

    const stopDemo = () => {
        console.log('stopping seqfx demo')

        logtailDemo.unsubscribe()
        process.exit(0)
    }

    setTimeout(stopDemo, timeout || 30000)
}

export default startDemo(process.argv[2])