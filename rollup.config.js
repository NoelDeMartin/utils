import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';

import { browser, module, main } from './package.json';

function build(output, includePolyfills = false, bundlePolyfills = false) {
    const extensions = ['.ts'];
    const plugins = [];

    plugins.push(typescript());

    if (includePolyfills)
        plugins.push(babel({
            extensions,
            babelHelpers: bundlePolyfills ? 'bundled' : 'runtime',
            plugins: [
                '@babel/plugin-proposal-class-properties',
                ...(
                    bundlePolyfills
                        ? []
                        : [
                            [
                                '@babel/plugin-transform-runtime',
                                { useESModules: output.format === 'esm' },
                            ],
                            [
                                // This can be removed when this is closed: https://github.com/babel/babel/issues/10759
                                'babel-plugin-transform-remove-imports', {
                                    test: /^regenerator-runtime\/runtime/,
                                },
                            ],
                        ]
                ),
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
        }));

    plugins.push(terser());

    return {
        input: 'src/main.ts',
        output: {
            sourcemap: true,
            ...output,
        },
        external: bundlePolyfills ? [] : [
            /^core-js\//,
            /^@babel\/runtime\//,
            /^regenerator-runtime\//,
        ],
        plugins,
    };
}

export default [
    build({ file: module, format: 'esm' }),
    build({ file: main, format: 'cjs' }, true),
    build({ file: browser, format: 'umd', name: 'NoelDeMartin_Utils' }, true, true),
];
