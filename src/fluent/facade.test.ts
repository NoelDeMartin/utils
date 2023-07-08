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

    it('Mocks instances using mock classes', () => {
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

    it('Mocks instances using mock classes', () => {
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
        const mockUsers = users.mock();
        const names = users.getNames();

        // Assert
        expect(names).toEqual(['mocked']);

        mockUsers.assertNamesCalled();
    });

});
