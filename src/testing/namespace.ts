import type { Closure } from '@/types/index';

let testingNamespace: TestingNamespace | undefined;

export interface TestingNamespace {
    fn<T extends Closure>(method?: T): T;
}

export function setTestingNamespace(namespace: TestingNamespace): void {
    testingNamespace = namespace;
}

export function testing(): TestingNamespace {
    return testingNamespace ?? jest;
}
