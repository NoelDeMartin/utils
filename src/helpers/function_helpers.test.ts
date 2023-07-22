import { intercept } from './function_helpers';

class Computer {

    public foo: string = '';

    public run(question: string): number {
        question;

        return 42;
    }

}

describe('Function helpers', () => {

    it('intercepts calls', () => {
        // Arrange
        const computer = new Computer();
        const callback = jest.fn();

        intercept(computer, 'run', (question) => callback(`Question: ${question}`));

        // Act
        const result = computer.run('What\'s the meaning of life?');

        // Assert
        expect(result).toEqual(42);
        expect(callback).toHaveBeenCalledWith('Question: What\'s the meaning of life?');
    });

});
