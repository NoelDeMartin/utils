import { facade } from './facade';

describe('Facades', () => {

    it('Mocks instances', () => {
        // Arrange
        class UsersService {

            public getNames(): string[] {
                return ['john', 'amy'];
            }

        }

        const users = facade(UsersService);

        // Act
        users.mock();
        users.getNames();

        // Assert
        expect(users.getNames).toHaveBeenCalled();
    });

    it('Mocks instances using provided mocks', () => {
        // Arrange
        class UsersService {

            public getNames(): string[] {
                return ['john', 'amy'];
            }

        }

        const users = facade(UsersService);

        // Act
        users.mock({ getNames: () => ['mocked'] });

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

        const users = facade(UsersService);

        // Act
        users.setMockClass(UsersServiceMock);
        users.mock();

        const names = users.getNames();

        // Assert
        expect(names).toEqual(['mocked']);
        expect(users.getNames).toHaveBeenCalled();
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

        const users = facade(UsersService);
        const usersMock = new UsersServiceMock();

        // Act
        users.mock(usersMock);

        const names = users.getNames();

        // Assert
        expect(names).toEqual(['mocked']);

        usersMock.assertNamesCalled();
    });

    it('mocks instances using mock facades', () => {
        // Arrange
        class CounterService {

            public count: number = 0;

            public add(): void {
                this.count++;
            }

        }

        class MockCounterService extends CounterService {

        }

        const counter = facade(CounterService);
        const mockCounter = facade(MockCounterService);

        // Act
        counter.setMockFacade(mockCounter);
        counter.mock();
        counter.add();
        counter.add();
        counter.add();

        // Assert
        expect(counter.add).toHaveBeenCalledTimes(3);
        expect(mockCounter.add).toHaveBeenCalledTimes(3);
        expect(counter.count).toEqual(3);
        expect(mockCounter.count).toEqual(3);
    });

    it('reset instances', () => {
        // Arrange
        class CounterService {

            public count: number = 0;

            public add(): void {
                this.count++;
            }

        }

        const counter = facade(CounterService);

        counter.add();

        // Act
        counter.reset();

        // Assert
        expect(counter.count).toEqual(0);
    });

});
