// eslint-disable-next-line no-undef
module.exports = {
    testRegex: '\\.test\\.ts$',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    collectCoverageFrom: [
        '<rootDir>/src/**/*',
    ],
    coveragePathIgnorePatterns: [
        '<rootDir>/src/main.ts',
    ],
    moduleFileExtensions: [
        'js',
        'ts',
    ],
};
