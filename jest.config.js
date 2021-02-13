const { compilerOptions } = require('./tsconfig');
const { pathsToModuleNameMapper } = require('ts-jest/utils');

module.exports = {
    testRegex: '\\.test\\.ts$',
    transform: { '^.+\\.ts$': 'ts-jest' },
    collectCoverageFrom: ['<rootDir>/src/**/*'],
    coveragePathIgnorePatterns: ['<rootDir>/src/main.ts'],
    moduleFileExtensions: ['js', 'ts'],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src/' }),
};
