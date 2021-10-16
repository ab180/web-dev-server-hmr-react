import { tryOptional } from '../utility/module'

import { Plugin } from '@web/dev-server-core'
import { build, BuildOptions } from 'esbuild'
import refreshBabel from 'react-refresh/babel'
import * as babel from '@babel/core'
import * as fs from 'fs/promises'

type ServerSource = {
    serveSource: Plugin['serve']
}

const createServerSource = async (root: string): Promise<ServerSource> => {
    return {
        serveSource: async ({ path, originalUrl }) => {
            const entry = root + path
            const state = await tryOptional(() => fs.stat(entry))

            if (
                !entry.startsWith('./node_modules')
                && entry.endsWith('.js')
                && state?.isFile()
            ) {
                const code_esbuild = await fs.readFile(entry, 'utf8')
                const code_babel = await babelRefreshCode(code_esbuild)
                const code_inject = injectRefreshCode(originalUrl, code_babel)

                return {
                    body: code_inject,
                    type: 'js',
                }
            }
        }
    }
}

const babelRefreshCode = async (code: string) => (
    await babel.transformAsync(code, {
        plugins: [
            [refreshBabel, { skipEnvCheck: true }],
        ],
    })
).code

const injectRefreshCode = (id: string, code: string) => `
import runtime from 'react-refresh/runtime'
runtime.injectIntoGlobalHook(window)

var prevRefreshReg = window.$RefreshReg$
var prevRefreshSig = window.$RefreshSig$

window.$RefreshReg$ = (type, id) => {
    runtime.register(type, '${id}' + id)
}

window.$RefreshSig$ = runtime.createSignatureFunctionForTransform

${code}

window.$RefreshReg$ = prevRefreshReg
window.$RefreshSig$ = prevRefreshSig

import.meta.hot.accept(module => {
    runtime.performReactRefresh()
})
`

export { createServerSource }