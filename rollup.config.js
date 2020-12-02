import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import { browser, module, main } from './package.json';

export default {
    input: 'src/main.ts',
    output: [
        { file: module, format: 'esm' },
        { file: main, format: 'cjs' },
        { file: browser, format: 'umd', name: 'NDMUtils' },
    ],
    plugins:  [
        typescript(),
        terser(),
    ],
};
