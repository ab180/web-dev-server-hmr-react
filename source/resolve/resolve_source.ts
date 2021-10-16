import { getPath } from '../utility/module'

import { Plugin } from '@web/dev-server-core'
import * as path from 'path'

type ResolverSource = {
    resolveSource: Plugin['resolveImport']
}

const createResolverSource = async (root: string): Promise<ResolverSource> => {
    return {
        resolveSource: async ({ source, context }) => {
            if (source.startsWith('./')) {
                const sourcePath = path.resolve(
                    root,
                    path.dirname('.' + context.originalUrl),
                    source,
                )
        
                return '/' + await getPath.withNonExtension(root, sourcePath)
            }
        }
    }
}

export { createResolverSource }