import { Plugin } from '@web/dev-server-core'
import { build, BuildOptions } from 'esbuild'
import { promisify } from 'util'
import resolve from 'resolve'

type ServerDependency = {
    serveDependency: Plugin['serve']
}

const createServerDependency = async (): Promise<ServerDependency> => {
    return {
        serveDependency: async ({ originalUrl }) => {
            if (originalUrl.startsWith('/node_modules/')) {
                const dependency = originalUrl.slice('/node_modules/'.length).slice(0, -'.js'.length)
                const entry = await promisify<string, string>(resolve)(dependency)

                const code_esbuild = await esbuildCode(entry)

                return {
                    body: code_esbuild,
                    type: 'js',
                }
            }
        }
    }
}

const esbuildCode = async (entry: string) => (
    await build({
        entryPoints: [entry],
        write: false,
        format: 'esm',
        bundle: true,
        minify: true,
        define: {
            'process.env.NODE_ENV': '\'development\'',
        }
    })
).outputFiles[0].text

export { createServerDependency }