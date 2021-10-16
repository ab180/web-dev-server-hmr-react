import { build, BuildOptions } from 'esbuild'

const buildOption: BuildOptions = {
    entryPoints: ['source/module.ts'],
    minify: true,
    bundle: true,
    plugins: [{
        name: 'make dependency external',
        setup: (build) => {
            build.onResolve({ filter: /^[^\.|\/]/ }, () => {
                return { external: true }
            })
        }
    }],
}

const _ = (async () => {
    await build(Object.assign(buildOption, {
        outfile: 'build/index.js',
        format: 'cjs',
    }))

    await build(Object.assign(buildOption, {
        outfile: 'build/index.module.js',
        format: 'esm',
    }))
})()