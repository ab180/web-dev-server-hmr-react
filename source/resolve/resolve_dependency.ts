import { getDependencies } from '../utility/module'

import { Plugin } from '@web/dev-server-core'

type ResolverDependecy = {
    resolveDependency: Plugin['resolveImport']
}

const createResolverDependecy = async (): Promise<ResolverDependecy> => {
    const dependencies = await getDependencies()

    return {
        resolveDependency: async ({ source }) => {
            if (dependencies.some(dependency => source.startsWith(dependency))) {
                return `/node_modules/${source}.js`
            }
        }
    }
}

export { createResolverDependecy }