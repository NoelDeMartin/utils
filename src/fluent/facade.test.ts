import { facade } from './facade';

describe('Facades', () => {

    it('Mocks instances', () => {
        // Arrange
        class UsersService {

            public getNames(): string[] {
                return ['john', 'amy'];
            }

        }

        const users = facade(new UsersService());

        // Act
        users.mock({ getNames: jest.fn(() => ['mocked']) });

        const names = users.getNames();

        // Assert
        expect(names).toEqual(['mocked']);
        expect(users.getNames).toHaveBeenCalled();
    });

    it('Mocks instances using mock class setter', () => {
        // Arrange
        class UsersService {

            public getNames(): string[] {
                return ['john', 'amy'];
            }

        }

        class UsersServiceMock extends UsersService {

            public getNames(): string[] {
                return ['mocked'];
            }

        }

        const users = facade(new UsersService());

        // Act
        users.setMockClass(UsersServiceMock);
        users.mock();

        const names = users.getNames();

        // Assert
        expect(names).toEqual(['mocked']);
        expect(users.getNames).toHaveBeenCalled();
    });

    it('Mocks instances using mock class initializer', () => {
        // Arrange
        class UsersService {

            public getNames(): string[] {
                return ['john', 'amy'];
            }

        }

        class UsersServiceMock extends UsersService {

            public getNames(): string[] {
                return ['mocked'];
            }

            public assertNamesCalled(): void {
                expect(this.getNames).toHaveBeenCalled();
            }

        }

        const users = facade(new UsersService(), UsersServiceMock);

        // Act
        const usersMock = users.mock();
        const names = users.getNames();

        // Assert
        expect(names).toEqual(['mocked']);

        usersMock.assertNamesCalled();
    });

    it('Mocks instances using mock class instance', () => {
        // Arrange
        class UsersService {

            public getNames(): string[] {
                return ['john', 'amy'];
            }

        }

        class UsersServiceMock extends UsersService {

            public getNames(): string[] {
                return ['mocked'];
            }

            public assertNamesCalled(): void {
                expect(this.getNames).toHaveBeenCalled();
            }

        }

        const users = facade(new UsersService());
        const usersMock = new UsersServiceMock();

        users.setMockInstance(usersMock);

        // Act
        users.mock();

        const names = users.getNames();

        // Assert
        expect(names).toEqual(['mocked']);

        usersMock.assertNamesCalled();
    });

});
