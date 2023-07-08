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

class PartialTargetMock implements Pick<Target, 'foo'> {

    public foo(): void {
        //
    }

}

class FullTargetMock extends Target {

    public foo(): void {
        //
    }

}

const targetMock = mock<Target>();
const targetMockWithClass = mock(new Target());
const targetMockWithEmptyObject = mock<Target>({});
const targetMockWithPartialMockClass = mock<Target>(new PartialTargetMock());
const targetMockWithFullMockClass = mock<Target>(new FullTargetMock());

describe('Mocking types', () => {

    it('mocks methods', () => {
        targetMockWithFullMockClass.foo();
        targetMockWithFullMockClass.bar();

        expect(targetMockWithFullMockClass.foo).toHaveBeenCalled();
        expect(targetMockWithFullMockClass.bar).toHaveBeenCalled();
    });

    it('has correct types', tt<
        Expect<Equals<typeof targetMock, Mock<Target>>> |
        Expect<Equals<typeof targetMockWithClass, Mock<Target>>> |
        Expect<Equals<typeof targetMockWithEmptyObject, Mock<Target>>> |
        Expect<Equals<typeof targetMockWithPartialMockClass, Mock<Target>>> |
        Expect<Equals<typeof targetMockWithFullMockClass, Mock<Target>>> |
        true
    >());

});
