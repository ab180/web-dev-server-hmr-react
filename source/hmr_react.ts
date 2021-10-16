import { createServerSource, createServerDependency } from './serve/module'
import { createResolverSource, createResolverDependecy } from './resolve/module'

import { Plugin } from '@web/dev-server-core'
import { hmrPlugin } from '@web/dev-server-hmr'

const hmrReact = async () => {
    let serveDependency: Plugin['serve']
    let serveSource: Plugin['serve']
    let resolveDependency: Plugin['resolveImport']
    let resolveSource: Plugin['resolveImport']

    const plugin: Plugin = {
        name: 'hmr-react',
        serverStart: async ({ config }) => {
            serveDependency = (await createServerDependency()).serveDependency
            serveSource = (await createServerSource(config.rootDir)).serveSource
            resolveDependency = (await createResolverDependecy()).resolveDependency
            resolveSource = (await createResolverSource(config.rootDir)).resolveSource
        },
        serve: async argument => (
            await serveDependency(argument)
            ?? await serveSource(argument)
        ),
        resolveImport: async argument => (
            await resolveDependency(argument)
            ?? await resolveSource(argument)
        ),
    }

    return [
        plugin,
        hmrPlugin(),
    ]
}

export { hmrReact }