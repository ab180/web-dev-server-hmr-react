import { tryOptional } from '../utility/module'

import { Plugin } from '@web/dev-server-core'
import { transform } from '@swc/core'
import * as fs from 'fs/promises'

type ServerSource = {
    serveSource: Plugin['serve']
}

const createServerSource = async (root: string): Promise<ServerSource> => {
    return {
        serveSource: async ({ path }) => {
            const entry = root + path
            const state = await tryOptional(() => fs.stat(entry))

            if (
                !entry.startsWith('./node_modules')
                && entry.endsWith('.js')
                && state?.isFile()
            ) {
                const code = await fs.readFile(entry, 'utf8')
                const code_refresh = await refreshCode(code)
                const code_inject = injectRefreshCode(path, code_refresh)

                return {
                    body: code_inject,
                    type: 'js',
                }
            }
        }
    }
}

const refreshCode = async (code: string) => (
    await transform(code, {
        jsc: {
            parser: {
                syntax: 'ecmascript',
                jsx: true,
            },
            target: 'es2020',
            transform: {
                react: {
                    refresh: true,
                    development: true,
                },
            },
        },
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