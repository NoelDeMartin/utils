import { required } from './required';

describe('required', () => {

    it('works with instanceof', () => {
        class Foo {}

        expect(required(() => new Foo)).toBeInstanceOf(Foo);
    });

    it('retains instance scope in methods calls', () => {
        // Arrange
        const data: { instance?: Foo } = {};

        class Foo {

            public isDataInstance(): boolean {
                return this === data.instance;
            }

        }

        data.instance = new Foo;

        // Act
        const foo = required(() => data.instance);

        // Assert
        expect(foo.isDataInstance()).toBe(true);
    });

});
