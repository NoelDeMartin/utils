import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import { browser, module, main } from './package.json';

export default {
    input: 'src/main.ts',
    output: [
        { file: module, format: 'esm', sourcemap: true },
        { file: main, format: 'cjs', sourcemap: true },
        { file: browser, format: 'umd', name: 'NDMUtils', sourcemap: true },
    ],
    plugins:  [
        typescript(),
        terser(),
    ],
};
