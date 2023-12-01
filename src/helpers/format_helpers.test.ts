import { formatCodeBlock } from './format_helpers';

describe('Format helpers', () => {

    it('Formats code blocks', () => {
        // Arrange
        const raw = `

            const foo = 'bar';

            if (foo) {
                doSomething();
            }

        `;
        const formatted = [
            'const foo = \'bar\';', //
            '', //
            'if (foo) {', //
            '    doSomething();', //
            '}', //
        ].join('\n');

        // Act
        const actual = formatCodeBlock(raw);

        // Assert
        expect(actual).toEqual(formatted);
    });

});
