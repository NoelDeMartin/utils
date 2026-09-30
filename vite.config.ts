import { URL, fileURLToPath } from 'node:url';

import { defineConfig } from 'vite-plus';

export default defineConfig({
    pack: {
        entry: { 'noeldemartin-utils': 'src/index.ts' },
        sourcemap: true,
        dts: true,
        fixedExtension: false,
        publint: true,
        attw: { profile: 'esm-only' },
    },
    resolve: {
        alias: {
            '@noeldemartin/utils': fileURLToPath(new URL('./src/', import.meta.url)),
        },
    },
    fmt: {
        semi: true,
        singleQuote: true,
        tabWidth: 4,
        printWidth: 120,
        sortImports: true,
    },
    lint: {
        options: {
            typeAware: true,
            typeCheck: true,
        },
        rules: {
            'no-console': 'error',
            'no-unused-expressions': 'off',
            'no-unused-vars': ['error', { argsIgnorePattern: '^_+$' }],
            'typescript/consistent-type-imports': 'error',
            'typescript/explicit-module-boundary-types': 'error',
            'typescript/no-explicit-any': ['warn', { ignoreRestArgs: true }],
            'typescript/no-unsafe-declaration-merging': 'off',
        },
        overrides: [
            {
                files: ['**/*.test.ts'],
                rules: { 'typescript/no-duplicate-type-constituents': 'off' },
            },
        ],
    },
});
