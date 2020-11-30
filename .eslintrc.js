// eslint-disable-next-line no-undef
module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
    ],
    ignorePatterns: [
        'dist',
    ],
    rules: {
        '@typescript-eslint/no-explicit-any': [
            'warn',
            {
                ignoreRestArgs: true,
            },
        ],
        '@typescript-eslint/no-inferrable-types': 'off',
        'comma-dangle': [
            'error',
            'always-multiline',
        ],
        'indent': [
            'error',
            4,
        ],
        'linebreak-style': [
            'error',
            'unix',
        ],
        'max-len': [
            'error',
            120,
        ],
        'quotes': [
            'error',
            'single',
        ],
        'quote-props': [
            'error',
            'consistent-as-needed',
        ],
        'semi': [
            'error',
            'always',
        ],
    },
};
