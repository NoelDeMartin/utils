import { URL, fileURLToPath } from 'node:url';

import { fmt, lint, pack } from '@noeldemartin/vite-plus-config';
import { defineConfig } from 'vite-plus';

export default defineConfig({
    pack: {
        ...pack,
        entry: { 'noeldemartin-utils': 'src/index.ts' },
    },
    resolve: {
        alias: {
            '@noeldemartin/utils': fileURLToPath(new URL('./src/', import.meta.url)),
        },
    },
    fmt,
    lint: { extends: [lint] },
});
