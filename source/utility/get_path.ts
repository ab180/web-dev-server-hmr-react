import { tryOptional } from './try_optional'

import * as path from 'path'
import * as fs from 'fs/promises'

const resolveCache = {}

const getPath = {
    withNonExtension: async (root: string, pathNonExtension: string) => {
        const directory = path.dirname(pathNonExtension)
        const name = path.basename(pathNonExtension)
    
        if (resolveCache[pathNonExtension] === undefined) {
            const files = await tryOptional(() => fs.readdir(directory))
            for (const file of files) {
                if (name === file || name === file.slice(0, file.lastIndexOf('.'))) {
                    resolveCache[pathNonExtension] = (
                        path.relative(root, path.resolve(directory, file))
                    )
                }
            }
        }

        return resolveCache[pathNonExtension]
    }
}

export { getPath }