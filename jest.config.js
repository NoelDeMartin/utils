module.exports = {
    testRegex: '\\.test\\.ts$',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    collectCoverageFrom: [
        '<rootDir>/src/**/*',
    ],
    coveragePathIgnorePatterns: [
        '<rootDir>/src/index\.ts',
    ],
    moduleFileExtensions: [
        'js',
        'ts',
    ],
};
