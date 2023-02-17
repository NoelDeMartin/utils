import { tt } from '@/testing/index';
import type { Equals, Expect } from '@/testing/index';

import { mock } from './mocking';
import type { Mock } from './mocking';

class Target {

    public foo(): void {
        //
    }

    public bar(): void {
        //
    }

}

class TargetMock implements Pick<Target, 'foo'> {

    public foo(): void {
        //
    }

}

const targetMock = mock<Target>();
const targetMockWithClass = mock(new Target());
const targetMockWithEmptyObject = mock<Target>({});
const targetMockWithMockClass = mock<Target>(new TargetMock());

describe('Mocking types', () => {

    it('has correct types', tt<
        Expect<Equals<typeof targetMock, Mock<Target>>> |
        Expect<Equals<typeof targetMockWithClass, Mock<Target>>> |
        Expect<Equals<typeof targetMockWithEmptyObject, Mock<Target>>> |
        Expect<Equals<typeof targetMockWithMockClass, Mock<Target>>> |
        true
    >());

});
