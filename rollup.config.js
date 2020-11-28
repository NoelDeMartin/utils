import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import { browser, module, main } from './package.json';

export default {
    input: 'src/main.ts',
    output: [
        { file: browser, format: 'umd', name: 'NDMUtils' },
        { file: main, format: 'cjs' },
        { file: module, format: 'es' },
    ],
    plugins:  [
        typescript(),
        terser(),
    ],
};
