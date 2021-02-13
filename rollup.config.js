import { babel } from '@rollup/plugin-babel';
import { resolve as resolvePath } from 'path';
import { terser } from 'rollup-plugin-terser';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

import { browser, module, main } from './package.json';
import { compilerOptions } from './tsconfig.json';

function build(output, bundleDependencies = false) {
    const extensions = ['.ts'];

    return {
        input: 'src/main.ts',
        output: {
            sourcemap: true,
            ...output,
        },
        external: bundleDependencies ? [] : [
            /^core-js\//,
            /^@babel\/runtime\//,
        ],
        plugins: [
            alias({
                entries: Object.entries(compilerOptions.paths).map(([alias, paths]) => ({
                    find: alias.slice(0, -2),
                    replacement: resolvePath(__dirname, './src/', paths[0]).slice(0, -2),
                })),
            }),
            resolve({ extensions }),
            commonjs(),
            babel({
                extensions,
                babelHelpers: bundleDependencies ? 'bundled' : 'runtime',
                plugins: [
                    '@babel/plugin-proposal-class-properties',
                    ...(bundleDependencies ? [] : ['@babel/plugin-transform-runtime']),
                ],
                presets: [
                    '@babel/preset-typescript',
                    [
                        '@babel/preset-env',
                        {
                            targets: '> 0.5%, last 2 versions, Firefox ESR, not dead',
                            corejs: { version: '3.8', proposals: true },
                            useBuiltIns: 'usage',
                        },
                    ],
                ],
            }),
            terser(),
        ],
    };
}

export default [
    build({ file: module, format: 'esm' }),
    build({ file: main, format: 'cjs' }),
    build({ file: browser, format: 'umd', name: 'NoelDeMartin_Utils' }, true),
];
