import MagicObject from './MagicObject';

class Stub extends MagicObject {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [property: string]: any;

    public constructor(private attributes: Record<string, unknown> = {}) {
        super();
    }

    public getAttributes(): Record<string, unknown> {
        return this.attributes;
    }

    protected __get(property: string): unknown {
        return this.attributes[property];
    }

    protected __set(property: string, value: unknown): void {
        this.attributes[property] = value;
    }

    protected __delete(property: string): void {
        delete this.attributes[property];
    }

}

describe('MagicObject', () => {

    it('Intercepts getters and setters', () => {
        // Arrange
        const object = new Stub({ lorem: 'ipsum' });

        // Act
        object.foo = 'bar';

        // Assert
        expect(object.foo).toEqual('bar');
        expect(object.lorem).toEqual('ipsum');
        expect(object.getAttributes()).toEqual({
            lorem: 'ipsum',
            foo: 'bar',
        });
    });

    it('Intercepts delete', () => {
        // Arrange
        const object = new Stub({ lorem: 'ipsum' });

        // Act
        delete object.lorem;

        // Assert
        expect(object.lorem).toBeUndefined();
        expect(object.getAttributes()).toEqual({});
    });

});
